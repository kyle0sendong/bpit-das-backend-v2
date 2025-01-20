const ApiBaseModel = require("@api/ApiBaseModel");

class AnalyzerBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName);
  }

}

module.exports = AnalyzerBaseModel;