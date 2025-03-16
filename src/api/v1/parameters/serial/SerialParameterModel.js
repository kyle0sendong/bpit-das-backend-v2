const ParameterBaseModel = require("../ParameterBaseModel");

class SerialParameterModel extends ParameterBaseModel {

  constructor() {
    super('serial_parameters');
  }
  
}

module.exports = new SerialParameterModel();