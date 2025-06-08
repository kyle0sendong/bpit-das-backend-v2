const {toSnakeCase} = require("../../../utils/strings.js");
const { getDateTimeNow } = require("../../../utils/date.js");
const { readModbusData, cleanFormula } = require("../../../utils/dataProcessing.js");
const ModbusRTU = require("modbus-serial");
const math = require('mathjs');

const AnalyzerDataModel = require("../../../api/v1/analyzer-data/AnalyzerDataModel.js");
const CurrentValueModel = require("../../../api/v1/current-values/CurrentValueModel.js");


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const serialOneMinutePolling = async (clientConnections, timebaseId, analyzers, parameters, accumulator) => {
  try {
    const date = new Date();
    const seconds = date.getSeconds();
    const datetimeNow = getDateTimeNow();

    // Process analyzers sequentially
    for (const analyzer of analyzers) {
      const clientIndex = clientConnections.findIndex((c) => c.name === `serial${analyzer.name}-${analyzer.id}`);
      let client = clientConnections[clientIndex];

      // Reconnect if client is missing or disconnected
      if (!client || !client.client.isOpen) {
        console.warn(`Client not found or disconnected for Serial Analyzer: ${analyzer.name} (${analyzer.id}). Reconnecting...`);
        
          try {
            const newClient = new ModbusRTU();
            await newClient.connectRTUBuffered(analyzer.port_name, {
              baudRate: analyzer.baud_rate,
              parity: analyzer.parity,
              dataBits: analyzer.data_bits,
              stopBits: analyzer.stop_bits
            });

            newClient.setID(analyzer.device_address);
            newClient.setTimeout(5000); // Prevents hanging

            console.log(`Reconnected to ${analyzer.port_name}`);

            if (clientIndex !== -1) {
              clientConnections.splice(clientIndex, 1);
            }
            
            // Push new client to the array
            client = { name: `serial${analyzer.name}-${analyzer.id}`, client: newClient };
            // Replace existing client in the array
            clientConnections.push({
              name: `serial${analyzer.name}-${analyzer.id}`,
              client: newClient
            });
            
          } catch (err) {
            console.error(`Failed to reconnect to ${analyzer.port_name} - ${err.message}`);
            return; // Skip this analyzer if reconnection fails
          }
        }


      const filteredParameters = parameters.filter((parameter) => analyzer.id === parameter.analyzer_id && parameter.enable === 1);
  
      // Process parameters sequentially to avoid overwhelming the device
      for (const parameter of filteredParameters) {
        try {
          const columnName = `serial${analyzer.id}_${toSnakeCase(parameter.name)}`;
          const accumulatorIndex = accumulator.findIndex((item) => item.name === columnName);
          const parameterAccumulator = accumulator[accumulatorIndex];

          if (seconds % parameter.request_interval == 0) {
            // Add delay between requests to the same device
            await delay(100); // 100ms delay between requests
            
            const data = await readModbusData(client.client, parameter);
            const currentValue = {
              analyzerId: analyzer.id,
              parameterId: parameter.id,
              timebaseId: timebaseId[0],
              data: { current_value: -9999, datetime: datetimeNow },
            };

            if (data !== null && data !== undefined) {
              const x = data;
              const cleanedFormula = cleanFormula(parameter.formula);
              const result = math.round(math.evaluate(cleanedFormula, { x }), 5);
              
              parameterAccumulator.count += 1;
              parameterAccumulator.value = parameterAccumulator.value + result;
              currentValue.data.current_value = result;
              await CurrentValueModel.updateCurrentValue(currentValue, "serial");
            } else {
              console.warn(`No data received for parameter ${parameter.name} on analyzer ${analyzer.name}`);
              await CurrentValueModel.updateCurrentValue(currentValue, "serial");
            }
          }

          if (seconds == 0) {
            const sampling = (60 / parameter.request_interval) * (analyzer.sampling / 100);
            const currentValue = {
              analyzerId: analyzer.id,
              parameterId: parameter.id,
              timebaseId: timebaseId[1],
              data: { current_value: -9999, datetime: datetimeNow },
            };

            if (parameterAccumulator.count >= sampling) {
              let averageValue = parameterAccumulator.value / parameterAccumulator.count;
              if (averageValue > 9999 || averageValue < -9999) averageValue = -9999;
              await AnalyzerDataModel.updateData({[columnName]: averageValue,datetime: datetimeNow},1);
              currentValue.data.current_value = averageValue;
              await CurrentValueModel.updateCurrentValue(currentValue, "serial");
            } else {
              await AnalyzerDataModel.updateData({[columnName]: -9999, datetime: datetimeNow},1);
              await CurrentValueModel.updateCurrentValue(currentValue, "serial");
            }
            parameterAccumulator.count = 0;
            parameterAccumulator.value = 0;
          }
        } catch (paramError) {
          console.error(`Error processing parameter ${parameter.name}:`, paramError.message);
        }
      }
      await delay(200);
    }

  } catch (error) {
    console.error('Error in serialOneMinutePolling:', error);
  }
}

module.exports = serialOneMinutePolling;