const ParameterModel = require('@apiV1/parameters/ParameterModel');
const AnalyzerBaseModel = require("../AnalyzerBaseModel");

class TcpAnalyzerModel extends AnalyzerBaseModel {

	constructor() {
    super('tcp_analyzers', ParameterModel.getTableName);
	}
}

module.exports = new TcpAnalyzerModel();
