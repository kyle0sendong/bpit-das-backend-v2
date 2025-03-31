const ModbusRTU = require("modbus-serial");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel.js");
const { toSnakeCase } = require("@utils/strings.js");

const setupCurrentValues = async (analyzers, parameters, timebases, type) => {
  for(let analyzer of analyzers) {
    const filteredParameters = parameters.filter((parameter) => analyzer.id === parameter.analyzer_id && parameter.enable === 1);
    for(let parameter of filteredParameters) {

      for(let timebase of timebases) {
        // create rows for the current values if it does not exist yet
        const isExist = await CurrentValueModel.checkCurrentValueExist(parameter.id, type, analyzer.id, timebase.id)
        if(isExist) continue;
        await CurrentValueModel.insert({
          timebase_id: timebase.id,
          parameter_id: parameter.id,
          [`${type}_id`]: analyzer.id
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


const createAccumulator = (analyzers, parameters, type) => {
  const accumulator = [];
  for(let analyzer of analyzers) {
    for(let parameter of parameters) {
      accumulator.push({
        name: `${type}${analyzer.id}_${toSnakeCase(parameter.name)}`,
        count: 0,
        value: 0
      });
    }
  }
  return accumulator;
}


// Modbus TCP Connections
const createTcpConnections = async (analyzers) => {

  const clients = [];
  for(let analyzer of analyzers) {
    const client = new ModbusRTU();
    try {
      await client.connectTCP(
        analyzer.host_address, 
        {
          port: analyzer.port, 
          unitId: analyzer.device_address, 
          timeout: 5000, 
          autoReconnect: true,
          reconnectTimeout: 2000
      });

      console.log(`Connected to ${analyzer.name} (${analyzer.host_address}:${analyzer.port})`);
      clients.push({
        name: `tcp${analyzer.name}-${analyzer.id}`,
        client: client
      });

    } catch(error) {
      console.log("error: ", error);
    }
  }
  return clients;
}

// Serial Port Connections
const createSerialConnections = async (analyzers) => {

  const clients = [];
  for(let analyzer of analyzers) {
    const client = new ModbusRTU();
    try {    

      await client.connectRTUBuffered(analyzer.port_name, {
        baudRate: analyzer.baud_rate,
        parity: analyzer.parity,
        dataBits: analyzer.data_bits,
        stopBits: analyzer.stop_bits
      });

      client.setID(analyzer.device_address);
      client.setTimeout(5000);

      console.log(`Connected to ${analyzer.port_name}`);
      clients.push({
        name: `serial${analyzer.name}-${analyzer.id}`,
        client: client
      });
    } catch (error) {
        console.error("Modbus Connection Error:", error.message);
    }
  }
  return clients;
}

const reconnectSerialClient = async (clientConnections, clientIndex, analyzer) => {
  try {
    const newClient = new ModbusRTU();
    await newClient.connectRTUBuffered(analyzer.port_name, {
      baudRate: analyzer.baud_rate,
      parity: analyzer.parity,
      dataBits: analyzer.data_bits,
      stopBits: analyzer.stop_bits
    });

    newClient.setID(analyzer.device_address);
    newClient.setTimeout(5000); // Prevent hanging

    console.log(`Reconnected to ${analyzer.port_name}`);

    // Replace the existing client in the array
    if (clientIndex !== -1) {
      clientConnections[clientIndex].client = newClient;
    } else {
      clientConnections.push({
        name: `serial${analyzer.name}-${analyzer.id}`,
        client: newClient
      });
    }

    return newClient;
  } catch (error) {
    console.error(`Failed to reconnect to ${analyzer.port_name} - ${error.message}`);
    return null; // Skip this serial analyzer if reconnection fails
  }
  

};



module.exports = {setupCurrentValues, setupVirtualChannelCurrentValues, createAccumulator, createTcpConnections, createSerialConnections, reconnectSerialClient};