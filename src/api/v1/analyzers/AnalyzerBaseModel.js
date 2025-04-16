const ApiBaseModel = require("../../ApiBaseModel.js");
const UserLogModel = require("../user-logs/UserLogModel.js");

class AnalyzerBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName);
  }


  async insertAnalyzer(data, type, user) {
    try {
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
    try {
      // get analyzer's data for proper logging
      const analyzerDetails = await this.getById(data.id);

      // Process log changes
      let changes = `Updated ${type} Analyzer '${analyzerDetails[0].name}' `;
      for(let column of Object.keys(data)) {
        if(column == "id") continue;
        if(analyzerDetails[0][column] != data[column]) {
          changes += `(${column}: '${analyzerDetails[0][column]}' to '${data[column]} ') `
        }
      }

      // Create Log Data
      const logData = {
        username: user.username,
        full_name: user.name,
        tags: "Analyzer, Update",
        changes: changes.trimEnd()
      };

      await this.update(data);
      return UserLogModel.insert(logData);
    } catch(error) {
      console.error("Error occurred: ", error);
    }
  }

  
  async deleteAnalyzer(id, type, user) {
    try {
      // get analyzer's data for proper logging
      const analyzerDetails = await this.getById(id);

      const logData = {
        username: user.username,
        full_name: user.name,
        tags: "Analyzer, Delete",
        changes: `Deleted ${type} Analyzer: '${analyzerDetails[0].name}'`
      };

      await this.delete(id);
      return await UserLogModel.insert(logData);
    } catch(error) {
      console.error("Error occurred: ", error);
    }
  }

}

module.exports = AnalyzerBaseModel;