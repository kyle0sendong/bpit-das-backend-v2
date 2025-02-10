const ApiBaseModel = require("@api/ApiBaseModel");
const UserLogModel = require("@apiV1/user-logs/UserLogModel");

class AnalyzerBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName);
  }

  // Insert Analyzer
  async insertAnalyzer(data, type, user) {
    try {
      // Create Log Data
      const logData = {
        username: user.username,
        full_name: user.name,
        tags: "Analyzer, Insert",
        changes: `Inserted ${type} Analyzer: '${data.name}'`
      };

      // Insert analyzer and log data
      await this.insert(data);
      return await UserLogModel.insert(logData);
    } catch(error) {
      return console.error("Error occurred: ", error);
    }
  }

  async updateAnalyzer(data, type, user) {



  }

  // Delete Analyzer
  async deleteAnalyzer(id, type, user) {
    try {
      // get analyzer's data for proper logging
      const analyzerData = await this.getById(id);

      // Create Log Data
      const logData = {
        username: user.username,
        full_name: user.name,
        tags: "Analyzer, Delete",
        changes: `Deleted ${type} Analyzer: '${analyzerData[0].name}'`
      };
      
      // Delete analyzer and insert log data
      await this.delete(id);
      return await UserLogModel.insert(logData);
    } catch(error) {
      console.error("Error occurred: ", error);
    }
  }

}

module.exports = AnalyzerBaseModel;