const {toSnakeCase} = require("@utils/strings");
const { getDateTimeNow } = require("@utils/date");
const { readModbusData, cleanFormula } = require("../utils")
const math = require('mathjs');

const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel");

const tcpOneMinutePolling = async (clientConnections, timebaseId, tcpAnalyzers, modbusTcpParameters, accumulator) => {

  try {

    const date = new Date();
    const seconds = date.getSeconds();

    await Promise.all(
      tcpAnalyzers.map(async (tcp) => {
        const client = clientConnections.find((connection) => connection.name === `${tcp.name}-${tcp.id}`);
        const tcpParameters = modbusTcpParameters.filter((parameter) => tcp.id === parameter.analyzer_id && parameter.enable === 1);
    
        await Promise.all(
          tcpParameters.map(async (parameter) => {
            const columnName = `tcp${tcp.id}_${toSnakeCase(parameter.name)}`;
            const accumulatorIndex = accumulator.findIndex((item) => item.name === columnName);
            const parameterAccumulator = accumulator[accumulatorIndex];
    
            if (seconds % parameter.request_interval == 0) {
              const data = await readModbusData(client.client, parameter);
              const currentValue = {
                analyzerId: tcp.id,
                parameterId: parameter.id,
                timebaseId: timebaseId,
                data: { current_value: -9999 },
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
    
            if (seconds == 0) {
              const sampling = (60 / parameter.request_interval) * (tcp.sampling / 100);
              if (parameterAccumulator.count >= sampling) {
                const averageValue = parameterAccumulator.value / parameterAccumulator.count;
                await AnalyzerDataModel.updateData(
                  {
                    [columnName]: averageValue,
                    datetime: getDateTimeNow(),
                  },
                  1
                );
              } else {
                await AnalyzerDataModel.updateData(
                  {
                    [columnName]: -9999,
                    datetime: getDateTimeNow(),
                  },
                  1
                );
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