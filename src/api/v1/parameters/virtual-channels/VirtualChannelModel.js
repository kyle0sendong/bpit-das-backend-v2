const ParameterBaseModel = require("../ParameterBaseModel");
const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const { toSnakeCase } = require("@utils/strings");
const UserLogModel = require("@apiV1/user-logs/UserLogModel");

class VirtualChannelModel extends ParameterBaseModel {
  constructor() {
    super("virtual_channels");
  }

  async deleteVirtualChannel(id, user) {

    const parameterDetails = await this.getById(id);

    const logData = {
      username: user.username,
      full_name: user.name,
      tags: "Parameter, Delete",
      changes: `Deleted parameter '${parameterDetails[0].name}' from 'Virtual Channels'`
    };

    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = ?
    `;

    try {
      // delete columns from data tables
      const columnName = toSnakeCase(`vc_${parameterDetails[0].name}`)
      await Promise.all([
        this.executeQuery(query, [id]),
        AlterTableDataColumnModel.deleteDataColumn({columnName})
      ])
      return UserLogModel.insert(logData);
    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }

}

module.exports = new VirtualChannelModel();