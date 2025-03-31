const ApiBaseModel = require("@api/ApiBaseModel.js");

class StationModel extends ApiBaseModel {
  constructor() {
    super('station')
  }
}

module.exports = new StationModel();