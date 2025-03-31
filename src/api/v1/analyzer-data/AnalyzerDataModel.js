const ApiBaseModel = require("@api/ApiBaseModel.js");
const ParameterBaseModel = require("@api/v1/parameters/ParameterBaseModel.js");
const VirtualChannelModel = require("@api/v1/parameters/virtual-channels/VirtualChannelModel.js");
const { toSnakeCase } = require("@utils/strings.js");

class AnalyzerDataModel extends ApiBaseModel{
  
  constructor() {
    super("data_t")
    this.parameterModel = new ParameterBaseModel('tcp_parameters')
  }
  
  async getAnalyzerData(data) {
    try {
      // take all analyzer parameters
      const parameters = await this.parameterModel.getParametersByAnalyzerIdAndType(data.analyzer, data.analyzerType);

      const columns = [
        "DATE_FORMAT(datetime, '%M %d, %Y %H:%i:%s') AS formatted_date, datetime", 
        ...parameters.map( (parameter) => toSnakeCase(`${data.analyzerType}${data.analyzer}_${parameter.name}`))
      ];

      const query = `
        SELECT ${columns} 
        FROM ${this.tableName}${data.timebase} 
        WHERE DATE(datetime) BETWEEN ? AND ?
        ORDER BY datetime DESC
      `;

      return this.executeQuery(query, [data.from, data.to]);
    } catch (error) {
      console.log(error)
    }
  }

  async getVirtualChannelsData(data) {
    try {
      // take all virtual channels
      const virtualChannels = await VirtualChannelModel.getAll();

      const columns = [
        "DATE_FORMAT(datetime, '%M %d, %Y %H:%i:%s') AS formatted_date, datetime", 
        ...virtualChannels.map( (virtualChannel) => toSnakeCase(`vc_${virtualChannel.name}`))
      ];

      const query = `
        SELECT ${columns} 
        FROM ${this.tableName}${data.timebase} 
        WHERE DATE(datetime) BETWEEN ? AND ?
        ORDER BY datetime DESC
      `;

      return this.executeQuery(query, [data.from, data.to]);
    } catch (error) {
      console.log(error)
    }
  }

  async getAnalyzerDataByRange(dateRange, columnName, timebase) {
    const query = `
      SELECT SUM(${columnName}) AS data, COUNT(${columnName}) AS dataCount
      FROM ${this.tableName}${timebase}
      WHERE datetime BETWEEN ? AND ?
      AND ${columnName} IS NOT NULL
      AND ${columnName} != -9999
    `;
    const result = await this.executeQuery(query, [dateRange[0], dateRange[1]]);
    return result[0];
  }

  async getAnalyzerDataByDate(date, columnName, timebase) {
    const query = `
      SELECT ${columnName} AS data
      FROM ${this.tableName}${timebase}
      WHERE datetime = ?
      AND ${columnName} IS NOT NULL
      AND ${columnName} != -9999
    `;
    const result = await this.executeQuery(query, [date]);
    return result[0];
  }

  insertData(data, timebase) {
    const query = `
      INSERT INTO ${this.tableName}${timebase}
      SET ?
    `;
    return this.executeQuery(query, [data])
  }

  updateData(data, timebase) {
    const query = `
      UPDATE ${this.tableName}${timebase}
      SET ?
      WHERE datetime = ?
    `;
    return this.executeQuery(query, [data, data.datetime]);
  }

}

module.exports = new AnalyzerDataModel();