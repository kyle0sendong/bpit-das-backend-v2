const {toSnakeCase} = require("@utils/strings");
const { getDateTimeNow } = require("@utils/date");
const { delay } = require("../utils")
const math = require('mathjs');
const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel");

const tcpAboveOneMinutePolling = async (dateRange, timebase, modbusTcpParameters, tcpAnalyzers) => {

  try {
    await delay(5000); // buffer delay for analyzer data

    await Promise.all(
      tcpAnalyzers.map(async (tcp) => {
        const tcpParameters = modbusTcpParameters.filter((parameter) => tcp.id === parameter.analyzer_id && parameter.enable === 1);
    
        await Promise.all(
          tcpParameters.map(async (parameter) => {
            const columnName = `tcp${tcp.id}_${toSnakeCase(parameter.name)}`;
            const data = await AnalyzerDataModel.getAnalyzerDataByRange(dateRange, columnName, 1);

            const currentValue = {
              analyzerId: tcp.id,
              parameterId: parameter.id,
              timebaseId: timebase.id,
              data: { current_value: -9999 },
            };
            const sampling = (data.dataCount / timebase.timebase) * 100;
            if (sampling > tcp.sampling) {
              const averageValue = math.round((data.data/data.dataCount), 5);
              currentValue.data.current_value = averageValue;
              await AnalyzerDataModel.updateData(
                {
                  [columnName]: averageValue,
                  datetime: getDateTimeNow(),
                },
                timebase.timebase
              );
            } else {
              await AnalyzerDataModel.updateData(
                {
                  [columnName]: -9999,
                  datetime: getDateTimeNow(),
                },
                timebase.timebase
              );
            }
            await CurrentValueModel.updateCurrentValue(currentValue, "tcp");
          })
        );
      })
    );

  } catch (error) {
    console.log(error);
  }
}

module.exports = tcpAboveOneMinutePolling;