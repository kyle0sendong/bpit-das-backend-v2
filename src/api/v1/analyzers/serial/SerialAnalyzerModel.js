const AnalyzerBaseModel = require("../AnalyzerBaseModel");

class SerialAnalyzerModel extends AnalyzerBaseModel {

	constructor() {
    super('serial_analyzers');
	}

}

module.exports = new SerialAnalyzerModel();
