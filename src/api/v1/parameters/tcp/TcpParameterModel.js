const ParameterBaseModel = require("@api/ParameterBaseModel");
const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");

class TcpParameterModel extends ParameterBaseModel {

  constructor() {
    super('tcp_parameters');
  }
  
}

module.exports = new TcpParameterModel();