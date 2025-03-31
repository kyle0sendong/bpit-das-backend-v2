// only a reference, use PollingScheduler.js for polling



const cron = require('node-cron');
const TimebaseModel = require("@apiV1/timebases/TimebaseModel.js");

const TcpAnalyzerModel = require("@apiV1/analyzers/tcp/TcpAnalyzerModel.js");
const TcpParameterModel = require("@apiV1/parameters/tcp/TcpParameterModel.js");
const SerialAnalyzerModel = require("@apiV1/analyzers/serial/SerialAnalyzerModel.js");
const SerialParameterModel = require("@apiV1/parameters/serial/SerialParameterModel.js");

const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel.js");
const VirtualChannelModel = require("@apiV1/parameters/virtual-channels/VirtualChannelModel.js");

const tcpOneMinutePolling = require("./modbus-tcp/tcpOneMinutePolling.js");
const tcpAboveOneMinutePolling = require("./modbus-tcp/tcpAboveOneMinutePolling.js");

const serialOneMinutePolling = require("./serial/serialOneMinutePolling.js");
const serialAboveOneMinutePolling = require("./serial/serialAboveOneMinutePolling.js");

const vcOneMinutePolling = require("./virtual-channels/vcOneMinutePolling.js");
const vcAboveOneMinutePolling = require("./virtual-channels/vcAboveOneMinutePolling.js");

const { getDateTimeNow, getDateRange } = require("@utils/date");

const {
  setupCurrentValues, 
  setupVirtualChannelCurrentValues, 
  createAccumulator, 
  createTcpConnections, 
  createSerialConnections } = require("./setups");

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


const createCronJobs = async (timebases, tcpAnalyzers, tcpParameters, serialAnalyzers, serialParameters, virtualChannels) => {

  const oneMinuteTimebase = timebases.find(item => item.timebase === 1);
  const currentDataTimebase = timebases.find(item => item.timebase === 0);

  const tcpClientConnections = await createTcpConnections(tcpAnalyzers);
  const tcpAccumulator = createAccumulator(tcpAnalyzers, tcpParameters, 'tcp');

  const serialClientConnections = await createSerialConnections(serialAnalyzers);
  const serialAccumulator = createAccumulator(serialAnalyzers, serialParameters, 'serial');

  // Loop through each timebase and create a cron job
  timebases.forEach((timebase) => {

    if(timebase.timebase == 1) {
      cron.schedule('*/5 * * * * *', async () => {
        await new Promise( (resolve) => {
          resolve(serialOneMinutePolling(serialClientConnections, [currentDataTimebase.id, oneMinuteTimebase.id], serialAnalyzers, serialParameters, serialAccumulator));
          resolve(tcpOneMinutePolling(tcpClientConnections, [currentDataTimebase.id, oneMinuteTimebase.id], tcpAnalyzers, tcpParameters, tcpAccumulator));
        })
      });

      cron.schedule('* * * * *', async () => {
        await new Promise( (resolve) => {
          resolve(AnalyzerDataModel.insertData({datetime: getDateTimeNow()}, 1));      // Create 1 row every minute inside the analyzer 1 minute data table
          resolve(vcOneMinutePolling(oneMinuteTimebase.id, virtualChannels, tcpParameters, serialParameters));
        })
      });
    }

    if (timebase.timebase > 1) {
      cron.schedule(getCronExpression(timebase.timebase), async () => {
        const dateRange = getDateRange(timebase.timebase);
        await new Promise( (resolve) => {
          resolve(AnalyzerDataModel.insertData({datetime: getDateTimeNow()}, timebase.timebase));
          resolve(tcpAboveOneMinutePolling(dateRange, timebase, tcpAnalyzers, tcpParameters));
          resolve(serialAboveOneMinutePolling(dateRange, timebase, serialAnalyzers, serialParameters));
          resolve(vcAboveOneMinutePolling(dateRange, virtualChannels, timebase));

        })
      });
    }
  });
}


const scheduledPolling = async () => {

  const timebases = await TimebaseModel.getEnabledTimebase();
  const tcpAnalyzers = await TcpAnalyzerModel.getAll();
  const tcpParameters = await TcpParameterModel.getAll();

  const serialAnalyzers = await SerialAnalyzerModel.getAll();
  const serialParameters = await SerialParameterModel.getAll();
  
  const virtualChannels = await VirtualChannelModel.getAll();

  await setupCurrentValues(tcpAnalyzers, tcpParameters, timebases, 'tcp');
  await setupCurrentValues(serialAnalyzers, serialParameters, timebases, 'serial');
  await setupVirtualChannelCurrentValues(virtualChannels, timebases);

  createCronJobs(timebases, tcpAnalyzers, tcpParameters, serialAnalyzers, serialParameters, virtualChannels);

}

module.exports = scheduledPolling;