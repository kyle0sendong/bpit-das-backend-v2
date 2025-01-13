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

  insertParameter(data) {
    const columns = Object.keys(data[0]);
    const values = data.map(item => columns.map(col => item[col]));
    
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES ?
    `;

    return this.executeQuery(query, [values])
  }
}

module.exports = new ParameterModel();