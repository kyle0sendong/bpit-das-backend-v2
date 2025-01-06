const ApiBaseModel = require("@api/ApiBaseModel");

class AnalyzerBaseModel extends ApiBaseModel {
  
  constructor(tableName, parameterTableName) {
    super(tableName);
    this.parameterTableName = parameterTableName;
  }

  getTcpWithParametersById(id) {
		const query = `
			SELECT ${this.tableName}.name, ${this.parameterTableName}.id, ${this.parameterTableName}.name 
      FROM ${this.tableName}
			INNER JOIN ${this.parameterTableName} ON ${this.parameterTableName}.id = ${this.tableName}.?
		`;
    return this.executeQuery(query, id);
	}
}

module.exports = AnalyzerBaseModel;