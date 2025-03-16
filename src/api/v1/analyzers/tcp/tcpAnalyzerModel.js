const AnalyzerBaseModel = require("../AnalyzerBaseModel");

class TcpAnalyzerModel extends AnalyzerBaseModel {

	constructor() {
    super('tcp_analyzers');
	}

}

module.exports = new TcpAnalyzerModel();
