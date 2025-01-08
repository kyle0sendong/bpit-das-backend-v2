const ApiBaseModel = require("@api/ApiBaseModel");

class VirtualChannelModel extends ApiBaseModel {
  constructor() {
    super("virtual_channels");
  }

  getVirtualChannelsByAnalyzerId(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE tcp_analyzer_id = ?
    `
    return this.executeQuery(query, [id]);
  }
}

module.exports = new VirtualChannelModel();