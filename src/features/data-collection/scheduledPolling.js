
const TimebaseModel = require("@apiV1/timebases/TimebaseModel");

const TcpAnalyzerModel = require("@apiV1/analyzers/tcp/TcpAnalyzerModel");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel");
const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel");

const TcpParameterModel = require("@apiV1/parameters/tcp/TcpParameterModel");
const VirtualChannelModel = require("@apiV1/parameters/virtual-channels/VirtualChannelModel");

const { getDateTimeNow } = require("@utils/date");
const { toSnakeCase } = require("@utils/strings");
const { getDateRange } = require("./utils");
const cron = require('node-cron');
const ModbusRTU = require("modbus-serial");

const tcpOneMinutePolling = require("./modbus-tcp/tcpOneMinutePolling");
const tcpAboveOneMinutePolling = require("./modbus-tcp/tcpAboveOneMinutePolling");

const vcOneMinutePolling = require("./virtual-channels/vcOneMinutePolling");
const vcAboveOneMinutePolling = require("./virtual-channels/vcAboveOneMinutePolling");

const setupModbusTcpCurrentValues = async (tcpAnalyzers, modbusTcpParameters, timebases) => {
  for(let analyzer of tcpAnalyzers) {
    const tcpParameters = modbusTcpParameters.filter((parameter) => analyzer.id === parameter.analyzer_id && parameter.enable === 1);
    for(let parameter of tcpParameters) {
      for(let timebase of timebases) {
        // create rows for the current values if it does not exist yet
        const isExist = await CurrentValueModel.checkCurrentValueExist(parameter.id, 'tcp', analyzer.id, timebase.id)
        if(isExist) continue;
        await CurrentValueModel.insert({
          timebase_id: timebase.id,
          parameter_id: parameter.id,
          tcp_id: analyzer.id
        })
      }
    }
  }
}

const setupVirtualChannelCurrentValues = async (virtualChannels, timebases) => {
  for(let virtualChannel of virtualChannels) {
    for(let timebase of timebases) {
      // create rows for the current values if it does not exist yet
      const isExist = await CurrentValueModel.checkCurrentValueExist(0, 'vc', virtualChannel.id, timebase.id)
      if(isExist) continue;
      await CurrentValueModel.insert({
        timebase_id: timebase.id,
        vc_id: virtualChannel.id,
      })
    }
  }
}


const createModbusTcpAccumulator = (tcpAnalyzers, modbusTcpParameters) => {
  const accumulator = [];
  for(let analyzer of tcpAnalyzers) {
    for(let parameter of modbusTcpParameters) {
      accumulator.push({
        name: `tcp${analyzer.id}_${toSnakeCase(parameter.name)}`,
        count: 0,
        value: 0
      });
    }
  }
  return accumulator;
}


const createConnections = async (tcpAnalyzers) => {

  const clients = [];
  for(let tcp of tcpAnalyzers) {
    const client = new ModbusRTU();
    try {
      await client.connectTCP(
        tcp.host_address, {
          port: tcp.port, 
          unitId: 
          tcp.device_address, 
          timeout: 5000, 
          autoReconnect: true,
          reconnectTimeout: 2000
      });

      console.log(`Connected to ${tcp.name} (${tcp.host_address}:${tcp.port})`);
      clients.push({
        name: `${tcp.name}-${tcp.id}`,
        client: client
      });

    } catch(error) {
      console.log("error: ", error);
    }
  }
  return clients;
}


// Function to convert minutes to cron expressions
const getCronExpression = (timebase) => {
  if (timebase === 60) {
    return `0 * * * *`;
  }  else if (timebase === 1440) {
    return `0 0 * * *`;
  } else if(timebase > 1 && timebase < 60) {
    return `*/${timebase} * * * *`; 
  } else if (timebase > 60 && timebase < 1440) {
    const hour = Math.floor(timebase/60);
    const minute = timebase % 60;
    return `${minute} */${hour} * * *`
  }
};


const createCronJobs = async (timebases, tcpParameters, tcpAnalyzers, virtualChannels) => {

  const oneMinuteTimebase = timebases.find(item => item.timebase === 1);
  const clientConnections = await createConnections(tcpAnalyzers);
  const accumulator = createModbusTcpAccumulator(tcpAnalyzers, tcpParameters);

  // Loop through each timebase and create a cron job
  timebases.forEach((timebase) => {

    if(timebase.timebase == 1) {
      cron.schedule('*/5 * * * * *', async () => {
        await new Promise( (resolve) => {
          return resolve(tcpOneMinutePolling(clientConnections, oneMinuteTimebase.id, tcpAnalyzers, tcpParameters, accumulator));
        })
      });

      // Create 1 row every minute inside the analyzer data table
      cron.schedule('* * * * *', async () => {
        await new Promise( (resolve) => {
          resolve(AnalyzerDataModel.insertData({datetime: getDateTimeNow()}, 1));
          resolve(vcOneMinutePolling(oneMinuteTimebase.id, virtualChannels, tcpParameters));
        })
      });
    }

    if (timebase.timebase > 1) {
      cron.schedule(getCronExpression(timebase.timebase), async () => {
        const dateRange = getDateRange(timebase.timebase);
        await new Promise( (resolve) => {
          resolve(AnalyzerDataModel.insertData({datetime: getDateTimeNow()}, timebase.timebase));
          resolve(vcAboveOneMinutePolling(dateRange, virtualChannels, timebase));
          resolve(tcpAboveOneMinutePolling(dateRange, timebase, tcpParameters, tcpAnalyzers));
        })
      });
    }
  });
}


const scheduledPolling = async () => {

  const timebases = await TimebaseModel.getEnabledTimebase();
  const tcpParameters = await TcpParameterModel.getAll();
  const tcpAnalyzers = await TcpAnalyzerModel.getAll();
  const virtualChannels = await VirtualChannelModel.getAll();

  await setupModbusTcpCurrentValues(tcpAnalyzers, tcpParameters, timebases);
  await setupVirtualChannelCurrentValues(virtualChannels, timebases);

  createCronJobs(timebases, tcpParameters, tcpAnalyzers, virtualChannels);

}

module.exports = scheduledPolling;