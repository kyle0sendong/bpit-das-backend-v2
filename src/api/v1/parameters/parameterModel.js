const ApiBaseModel = require("@api/ApiBaseModel");

class ParameterModel extends ApiBaseModel {

  constructor() {
    super('parameters');
  }

  getParametersByAnalyzerId(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE tcp_analyzer_id = ?
    `
    return this.executeQuery(query, [id]);
  }
}

module.exports = new ParameterModel();