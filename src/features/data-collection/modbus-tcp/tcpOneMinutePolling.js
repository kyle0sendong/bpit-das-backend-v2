const math = require('mathjs');
const ModbusRTU = require("modbus-serial");

const {toSnakeCase} = require("../../../utils/strings.js");
const { getDateTimeNow } = require("../../../utils/date.js");
const { readModbusData, cleanFormula } = require("../../../utils/dataProcessing.js");

const AnalyzerDataModel = require("../../../api/v1/analyzer-data/AnalyzerDataModel.js");
const CurrentValueModel = require("../../../api/v1/current-values/CurrentValueModel.js");

const tcpOneMinutePolling = async (clientConnections, timebaseId, analyzers, parameters, accumulator) => {

  try {

    const date = new Date();
    const seconds = date.getSeconds();
    const datetimeNow = getDateTimeNow();

    await Promise.all(
      analyzers.map(async (analyzer) => {
        const clientIndex = clientConnections.findIndex((c) => c.name === `tcp${analyzer.name}-${analyzer.id}`);
        let client = clientConnections[clientIndex];

        // Reconnect if the client is missing or disconnected
        if (!client || !client.client.isOpen) {
          console.warn(`Client not found or disconnected for TCP Analyzer: ${analyzer.name} (${analyzer.id}). Reconnecting...`);

          try {
            const newClient = new ModbusRTU();
            await newClient.connectTCP(analyzer.host_address, {
              port: analyzer.port,
              unitId: analyzer.device_address, 
              timeout: 5000
            });

            console.log(`Reconnected to ${analyzer.host_address}:${analyzer.port}`);

            // Remove old entry if it exists
            if (clientIndex !== -1) {
              clientConnections.splice(clientIndex, 1);
            }

            // Push new client to the array
            client = { name: `tcp${analyzer.name}-${analyzer.id}`, client: newClient };
            clientConnections.push(client);
          } catch (err) {
            console.error(`Failed to reconnect to ${analyzer.host_address}:${analyzer.port} - ${err.message}`);
            return; // Skip this TCP analyzer if reconnection fails
          }
        }

        const filteredParameters = parameters.filter((parameter) => analyzer.id === parameter.analyzer_id && parameter.enable === 1);
        
        await Promise.all(
          filteredParameters.map(async (parameter) => {
            const columnName = `tcp${analyzer.id}_${toSnakeCase(parameter.name)}`;
            const accumulatorIndex = accumulator.findIndex((item) => item.name === columnName);
            const parameterAccumulator = accumulator[accumulatorIndex];
    
            // Run every interval
            if (seconds % parameter.request_interval == 0) {
              const data = await readModbusData(client.client, parameter);
              const currentValue = {
                analyzerId: analyzer.id,
                parameterId: parameter.id,
                timebaseId: timebaseId[0],
                data: { current_value: -9999, datetime: datetimeNow },
              };
    
              if (data) {
                const x = data;
                const cleanedFormula = cleanFormula(parameter.formula);
                const result = math.round(math.evaluate(cleanedFormula, { x }), 5);
                
                parameterAccumulator.count += 1;
                parameterAccumulator.value = parameterAccumulator.value + result;
                currentValue.data.current_value = result;
                await CurrentValueModel.updateCurrentValue(currentValue, "tcp");
              } else {
                await CurrentValueModel.updateCurrentValue(currentValue, "tcp");
              }
            }
    
            // After finishing a minute
            if (seconds == 0) {
              const currentValue = {
                analyzerId: analyzer.id,
                parameterId: parameter.id,
                timebaseId: timebaseId[1],
                data: { current_value: -9999 },
              };
              const sampling = (60 / parameter.request_interval) * (analyzer.sampling / 100);

              if (parameterAccumulator.count >= sampling) {
                const averageValue = parameterAccumulator.value / parameterAccumulator.count;
                await AnalyzerDataModel.updateData({[columnName]: averageValue, datetime: datetimeNow}, 1);
                currentValue.data.current_value = averageValue;
                await CurrentValueModel.updateCurrentValue(currentValue, "tcp");
              } else {
                await AnalyzerDataModel.updateData({[columnName]: -9999, datetime: datetimeNow}, 1);
                await CurrentValueModel.updateCurrentValue(currentValue, "tcp");
              }
              parameterAccumulator.count = 0;
              parameterAccumulator.value = 0;
            }
          })
        );
      })
    );

  } catch (error) {
    console.log(error);
  }
}

module.exports = tcpOneMinutePolling;