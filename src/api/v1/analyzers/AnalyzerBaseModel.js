const ApiBaseModel = require("@api/ApiBaseModel");
const UserLogModel = require("@apiV1/user-logs/UserLogModel");

class AnalyzerBaseModel extends ApiBaseModel {

  // Insert Analyzer
  async insertAnalyzer(data, type, user) {

    // Create Log Data
    const logData = {
      username: user.username,
      full_name: user.name,
      tags: "Analyzer, Insert",
      changes: `Inserted '${type}' Analyzer: '${data.name}'`
    };

    // Insert log data and analyzer
    try {
      await UserLogModel.insert(logData);
      return await this.insert(data);
    } catch(error) {
      return console.error("Error occurred: ", error);
    }
  }

  updateAnalyzer() {

  }

  deleteAnalyzer() {

  }
  constructor(tableName) {
    super(tableName);
  }

}

module.exports = AnalyzerBaseModel;