const ParameterBaseModel = require("../ParameterBaseModel.js");

class TcpParameterModel extends ParameterBaseModel {

  constructor() {
    super('tcp_parameters');
  }
  
}

module.exports = new TcpParameterModel();