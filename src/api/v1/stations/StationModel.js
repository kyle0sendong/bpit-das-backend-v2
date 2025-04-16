const ApiBaseModel = require("../../ApiBaseModel.js");

class StationModel extends ApiBaseModel {
  constructor() {
    super('station')
  }
}

module.exports = new StationModel();