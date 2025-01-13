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

  updateParameter(dataArray) {
    
    const columns = ['name', 'unit', 'enable', 'request_interval', 'format', 'function_code', 'start_register_address', 'register_count', 'formula'];
    let sql = `UPDATE ${this.tableName} SET `;
    const values = [];
    const ids = [];
    dataArray.forEach(data => ids.push(data.id));

    columns.forEach( column => {
      const hasColumn = dataArray.some((data) => data[column] !== undefined)

      if (hasColumn) {
        sql += `${column} = CASE `
        dataArray.forEach( (data) => {
          if(data[column] != undefined) {
            sql += `WHEN id = ? THEN ? `
            values.push(data.id, data[column])
          }
        })
        sql += `ELSE ${column} END, `
      }
    });

    sql = sql.slice(0, -2);
    sql += ` WHERE id IN (${ids})`

    return this.executeQuery(sql, values)

  }
}

module.exports = new ParameterModel();