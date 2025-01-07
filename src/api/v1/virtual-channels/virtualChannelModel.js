const ApiBaseModel = require("@api/ApiBaseModel");

class VirtualChannelModel extends ApiBaseModel {
  constructor() {
    super("virtual_channels");
  }
}

module.exports = new VirtualChannelModel();