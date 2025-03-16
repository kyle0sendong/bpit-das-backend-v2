const ApiBaseModel = require("@api/ApiBaseModel");
const ParameterBaseModel = require("@api/v1/parameters/ParameterBaseModel");
const { toSnakeCase } = require("@utils/strings");

class AnalyzerDataModel extends ApiBaseModel{
  
  constructor() {
    super("data_t")
  }
  
  async getAnalyzerData(data) {

    // take all analyzer parameters
    const parameters = await ParameterBaseModel.getParametersByAnalyzerId(data.analyzer);
    const columns = [
      "DATE_FORMAT(datetime, '%M %d, %Y %H:%i:%s') AS formatted_date, datetime", 
      ...parameters.map( (parameter) => toSnakeCase(`${parameter.name}_${data.analyzerType}${data.analyzer}`))
    ];
    const query = `
      SELECT ${columns} 
      FROM ${this.tableName}${data.timebase} 
      WHERE DATE(datetime) BETWEEN ? AND ?
      ORDER BY datetime DESC
    `;

    return this.executeQuery(query, [data.from, data.to]);
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