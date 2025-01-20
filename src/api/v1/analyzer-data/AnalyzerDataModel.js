const ApiBaseModel = require("@api/ApiBaseModel");
const ParameterModel = require("@api/v1/parameters/ParameterModel");
const { toSnakeCase } = require("@utils/strings");

class AnalyzerDataModel extends ApiBaseModel{
  
  constructor() {
    super("data_t")
  }
  
  async getAnalyzerData(data) {
    const query = `SELECT ? FROM ${this.tableName}${data.timebase} WHERE datetime >= 2024-08-01 AND datetime <= ?`;

    // take all analyzer parameters
    const parameters = await ParameterModel.getParametersByAnalyzerId(data.analyzer);
    const parameterNames = parameters.map( (data) => `${toSnakeCase(data.name)}${data.analyzer}`);
    return this.executeQuery(query, [parameterNames, data.to]);
  }

}

module.exports = new AnalyzerDataModel();