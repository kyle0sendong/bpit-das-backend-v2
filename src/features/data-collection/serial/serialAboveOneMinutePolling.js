const {toSnakeCase} = require("@utils/strings.js");
const { getDateTimeNow } = require("@utils/date.js");
const { delay } = require("@utils/delay.js")
const math = require('mathjs');
const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel.js");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel.js");

const serialAboveOneMinutePolling = async (dateRange, timebase, analyzers, parameters) => {

  try {
    const datetimeNow = getDateTimeNow();
    await delay(5000); // buffer delay for analyzer data
    await Promise.all(
      analyzers.map(async (analyzer) => {
        const filteredParameters = parameters.filter((parameter) => analyzer.id === parameter.analyzer_id && parameter.enable === 1);
    
        await Promise.all(
          filteredParameters.map(async (parameter) => {
            const columnName = `serial${analyzer.id}_${toSnakeCase(parameter.name)}`;
            const data = await AnalyzerDataModel.getAnalyzerDataByRange(dateRange, columnName, 1);

            const currentValue = {
              analyzerId: analyzer.id,
              parameterId: parameter.id,
              timebaseId: timebase.id,
              data: { current_value: -9999, datetime: datetimeNow },
            };
            const sampling = (data.dataCount / timebase.timebase) * 100;
            if (sampling > analyzer.sampling) {
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
            await CurrentValueModel.updateCurrentValue(currentValue, "serial");
          })
        );
      })
    );

  } catch (error) {
    console.log(error);
  }
}

module.exports = serialAboveOneMinutePolling;