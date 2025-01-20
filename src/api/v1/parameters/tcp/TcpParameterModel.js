const ParameterBaseModel = require("../ParameterBaseModel");

class TcpParameterModel extends ParameterBaseModel {

  constructor() {
    super('tcp_parameters');
  }
  
}

module.exports = new TcpParameterModel();