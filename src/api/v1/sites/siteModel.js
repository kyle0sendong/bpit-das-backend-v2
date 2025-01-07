const ApiBaseModel = require("@api/ApibaseModel");

class SiteModel extends ApiBaseModel {
  constructor() {
    super('sites')
  }
}

module.exports = new SiteModel();