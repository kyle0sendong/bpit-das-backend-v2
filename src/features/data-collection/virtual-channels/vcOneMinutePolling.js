const math = require('mathjs');

const { toSnakeCase } = require("@utils/strings");
const { getDateTimeNow } = require("@utils/date");
const { delay } = require("../utils");
const AnalyzerDataModel = require("@apiV1/analyzer-data/AnalyzerDataModel");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel");

const getVirtualChannelVariables = async (datetime, virtualChannel, tcpParameters) => {
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
      }
    })
  );

  return result;
};

const vcOneMinutePolling = async (timebaseId, virtualChannels, tcpParameters) => {

  try {
    const datetime = getDateTimeNow();
    await delay(5000); // buffer delay for analyzer data
    // Process all virtual channels in parallel using Promise.all()
    await Promise.all(
      virtualChannels.map(async (virtualChannel) => {
        const virtualChannelVariables = await getVirtualChannelVariables(datetime, virtualChannel, tcpParameters);
        const currentValue = {
          parameterId: 0,
          analyzerId: virtualChannel.id,
          timebaseId,
          data: { current_value: -9999 },
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
