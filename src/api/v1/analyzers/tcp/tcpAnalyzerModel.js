const parameterModel = require('@apiV1/parameters/ParameterModel');
const AnalyzerBaseModel = require("../AnalyzerBaseModel");

class TcpAnalyzerModel extends AnalyzerBaseModel {
  
	constructor() {
    super('tcp_analyzers', parameterModel.getTableName);
	}
}

module.exports = new TcpAnalyzerModel();
