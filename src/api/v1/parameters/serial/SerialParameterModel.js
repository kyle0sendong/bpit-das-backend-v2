const ParameterBaseModel = require("../ParameterBaseModel.js");

class SerialParameterModel extends ParameterBaseModel {

  constructor() {
    super('serial_parameters');
  }
  
}

module.exports = new SerialParameterModel();