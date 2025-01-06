const ApiBaseModel = require("@api/ApiBaseModel");

class AnalyzerBaseModel extends ApiBaseModel {

  constructor(tableName, parameterTableName) {
    super(tableName);
    this.parameterTableName = parameterTableName;
  }

}

module.exports = AnalyzerBaseModel;