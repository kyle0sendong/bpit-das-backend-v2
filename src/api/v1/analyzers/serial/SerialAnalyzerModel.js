const AnalyzerBaseModel = require("../AnalyzerBaseModel.js");
const SerialPort = require('serialport');

class SerialAnalyzerModel extends AnalyzerBaseModel {

	constructor() {
    super('serial_analyzers');
	}

  async getAvailablePorts() {
    try {
      const ports = await SerialPort.list();
      return ports;
    } catch (error) {
      console.error('Error listing serial ports:', error);
    }
  }
  

}

module.exports = new SerialAnalyzerModel();
