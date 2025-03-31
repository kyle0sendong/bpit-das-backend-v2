const AnalyzerBaseModel = require("../AnalyzerBaseModel.js");
const { SerialPort, SerialPortInfo } = require('serialport');

class SerialAnalyzerModel extends AnalyzerBaseModel {

	constructor() {
    super('serial_analyzers');
	}

  async getAvailablePorts() {
    const ports = await SerialPort.list();
    return ports;
  }
  
}

module.exports = new SerialAnalyzerModel();
