const {toSnakeCase} = require("../../../utils/strings.js");
const { getDateTimeNow } = require("../../../utils/date.js");
const { delay } = require("../../../utils/delay.js")
const math = require('mathjs');
const AnalyzerDataModel = require("../../../api/v1/analyzer-data/AnalyzerDataModel.js");
const CurrentValueModel = require("../../../api/v1/current-values/CurrentValueModel.js");

const vcAboveOneMinutePolling = async (dateRange, virtualChannels, timebase) => {

  try {
    const datetimeNow = getDateTimeNow();
    // get all virtual channel
    await delay(5000); // buffer delay for analyzer data
    for(let virtualChannel of virtualChannels) {
      const columnName = `vc_${toSnakeCase(virtualChannel.name)}`;
      const data = await AnalyzerDataModel.getAnalyzerDataByRange(dateRange, columnName, 1);
      const currentValue = {
        parameterId: 0,
        analyzerId: virtualChannel.id,
        timebaseId: timebase.id,
        data: { current_value: -9999, datetime: datetimeNow },
      };

      if(data) {
        let averageValue = -9999;
        if(data.data && data.dataCount > 0) averageValue = math.round((data.data/data.dataCount), 5);
        currentValue.data.current_value = averageValue;
        await AnalyzerDataModel.updateData(
          {
            [columnName]: averageValue,
            datetime: datetimeNow,
          },
          timebase.timebase
        );
      }
      
      await CurrentValueModel.updateCurrentValue(currentValue, "vc");
    }
  } catch(error) {
    console.log(error)
  }
  
}

module.exports = vcAboveOneMinutePolling;