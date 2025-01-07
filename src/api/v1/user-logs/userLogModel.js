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
  
  getLogByDate(date) {
    const query = `
      SELECT * 
      FROM ${this.tableName} 
      WHERE date = ?
    `;
    return this.executeQuery(query, [date]);
  }

  getLogByDateRange(data) {
    const query = `
      SELECT * 
      FROM ${this.tableName} 
      WHERE date >= ? and date <= ?
    `;
    return this.executeQuery(query, [data.startDate, data.endDate]);
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