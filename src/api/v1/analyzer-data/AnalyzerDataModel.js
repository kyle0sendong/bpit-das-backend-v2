const ApiBaseModel = require("@api/ApiBaseModel");
const TcpParameterModel = require("@api/v1/parameters/tcp/TcpParameterModel");
const { toSnakeCase } = require("@utils/strings");

class AnalyzerDataModel extends ApiBaseModel{
  
  constructor() {
    super("data_t")
  }
  
  async getAnalyzerData(data) {

    // take all analyzer parameters
    const parameters = await TcpParameterModel.getParametersByAnalyzerId(data.analyzer);
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

}

module.exports = new AnalyzerDataModel();