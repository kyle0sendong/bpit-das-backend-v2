const ApiBaseModel = require("@api/ApibaseModel");

class StationModel extends ApiBaseModel {
  constructor() {
    super('station')
  }
}

module.exports = new StationModel();