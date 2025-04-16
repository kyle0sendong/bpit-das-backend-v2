const math = require('mathjs');

const { toSnakeCase } = require("../../../utils/strings.js");
const { getDateTimeNow } = require("../../../utils/date.js");
const { delay } = require("../../../utils/delay.js");
const AnalyzerDataModel = require("../../../api/v1/analyzer-data/AnalyzerDataModel.js");
const CurrentValueModel = require("../../../api/v1/current-values/CurrentValueModel.js");

const getVirtualChannelVariables = async (datetime, virtualChannel, tcpParameters, serialParameters) => {
  const result = {};
  const keys = ['x', 'y', 'z', 'a', 'b', 'c'];

  // Create an array of Promises to resolve all variables asynchronously
  await Promise.all(
    keys.map(async (key) => {
      if (virtualChannel[key] !== null) {
        const [type, id] = virtualChannel[key].split('-');
        if (type === 'tcp') {
          const parameter = tcpParameters.find(item => item.id === parseInt(id));
          if (parameter) {
            const columnName = `tcp${parameter.analyzer_id}_${toSnakeCase(parameter.name)}`;
            const data = await AnalyzerDataModel.getAnalyzerDataByDate(datetime, columnName, 1);
            if (data) {
              result[key] = data.data;
            }
          }
        }

        if (type === 'serial') {
          const parameter = serialParameters.find(item => item.id === parseInt(id));
          if (parameter) {
            const columnName = `serial${parameter.analyzer_id}_${toSnakeCase(parameter.name)}`;
            const data = await AnalyzerDataModel.getAnalyzerDataByDate(datetime, columnName, 1);
            if (data) {
              result[key] = data.data;
            }
          }
        }
      }
    })
  );
  return result;
};

const vcOneMinutePolling = async (timebaseId, virtualChannels, tcpParameters, serialParameters) => {

  try {
    const datetime = getDateTimeNow();
    await delay(5000); // buffer delay for analyzer data
    // Process all virtual channels in parallel using Promise.all()
    await Promise.all(
      virtualChannels.map(async (virtualChannel) => {
        const virtualChannelVariables = await getVirtualChannelVariables(datetime, virtualChannel, tcpParameters, serialParameters);
        const currentValue = {
          parameterId: 0,
          analyzerId: virtualChannel.id,
          timebaseId,
          data: { current_value: -9999, datetime: datetime },
        };

        try {
          const result = math.round(math.evaluate(virtualChannel.formula, virtualChannelVariables), 5);
          currentValue.data.current_value = result;

          await Promise.all([
            CurrentValueModel.updateCurrentValue(currentValue, "vc"),
            AnalyzerDataModel.updateData(
              {
                [`vc_${toSnakeCase(virtualChannel.name)}`]: result,
                datetime: datetime,
              },
              1
            ),
          ]);
        } catch (error) {
          await Promise.all([
            CurrentValueModel.updateCurrentValue(currentValue, "vc"),
            AnalyzerDataModel.updateData(
              {
                [`vc_${toSnakeCase(virtualChannel.name)}`]: -9999,
                datetime: datetime,
              },
              1
            ),
          ]);
        }
      })
    );
  } catch (error) {
    console.error("Error in vcOneMinutePolling:", error);
  }
};

module.exports = vcOneMinutePolling;
