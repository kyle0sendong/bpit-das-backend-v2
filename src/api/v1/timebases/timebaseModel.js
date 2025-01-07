const ApiBaseModel = require("@api/ApiBaseModel");

class TimebaseModel extends ApiBaseModel {
  constructor() {
    super('timebases');
  }
}

module.exports = new TimebaseModel();