const math = require('mathjs');

const {toSnakeCase} = require("@utils/strings.js");
const { getDateTimeNow } = require("@utils/date.js");
const { delay } = require("@utils/delay.js")

const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel.js");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel.js");

const tcpAboveOneMinutePolling = async (dateRange, timebase, analyzers, parameters) => {

  try {
    await delay(5000); // buffer delay for analyzer data
    const datetimeNow = getDateTimeNow();
    await Promise.all(
      analyzers.map(async (tcp) => {
        const filteredParameters = parameters.filter((parameter) => tcp.id === parameter.analyzer_id && parameter.enable === 1);
    
        await Promise.all(
          filteredParameters.map(async (parameter) => {
            const columnName = `tcp${tcp.id}_${toSnakeCase(parameter.name)}`;
            const data = await AnalyzerDataModel.getAnalyzerDataByRange(dateRange, columnName, 1);

            const currentValue = {
              analyzerId: tcp.id,
              parameterId: parameter.id,
              timebaseId: timebase.id,
              data: { current_value: -9999, datetime: datetimeNow },
            };
            const sampling = (data.dataCount / timebase.timebase) * 100;
            if (sampling > tcp.sampling) {
              const averageValue = math.round((data.data/data.dataCount), 5);
              currentValue.data.current_value = averageValue;
              await AnalyzerDataModel.updateData(
                {
                  [columnName]: averageValue,
                  datetime: datetimeNow,
                },
                timebase.timebase
              );
            } else {
              await AnalyzerDataModel.updateData(
                {
                  [columnName]: -9999,
                  datetime: datetimeNow,
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