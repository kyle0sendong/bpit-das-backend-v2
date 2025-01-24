const ApiBaseModel = require("@api/ApiBaseModel");

class UserLogModel extends ApiBaseModel {

  constructor() {
      super("user_logs");
  }

  getLatestLog() {
    const query = `
      SELECT * ${this.tableName}
      ORDER BY id DESC
      LIMIT 1
    `;
    return this.executeQuery(query);
  }
  
  getLogByDate(from, to) {
    const query = `
      SELECT 
        DATE_FORMAT(datetime, '%M %d, %Y %H:%i:%s') AS formatted_date,
        datetime,
        username,
        tags,
        changes
      FROM ${this.tableName} 
      WHERE DATE(datetime) BETWEEN ? AND ?
      ORDER BY datetime DESC
    `;
    return this.executeQuery(query, [from, to]);
  }

  getDistinctDate() {
    const query = `
      SELECT DISTINCT date 
      FROM ${this.tableName}
    `;
    return this.executeQuery(query);
  }
}

module.exports = new UserLogModel();