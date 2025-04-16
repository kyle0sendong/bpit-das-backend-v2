const ParameterBaseModel = require("../ParameterBaseModel.js");
const AlterTableDataColumnModel = require("../../../../database/database-operations/AlterTableDataColumnModel.js");
const CurrentValueModel = require("../../current-values/CurrentValueModel.js");
const { toSnakeCase } = require("../../../../utils/strings.js");
const UserLogModel = require("../../user-logs/UserLogModel.js");

class VirtualChannelModel extends ParameterBaseModel {
  constructor() {
    super("virtual_channels");
  }

  async deleteVirtualChannel(id, user) {

    const parameter = await this.getById(id);

    const logData = {
      username: user.username,
      full_name: user.name,
      tags: "Parameter, Delete",
      changes: `Deleted parameter '${parameter[0].name}' from 'Virtual Channels'`
    };

    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = ?
    `;

    try {
      // delete columns from data tables
      const columnName = toSnakeCase(`vc_${parameter[0].name}`);
      await Promise.all([
        this.executeQuery(query, [id]),
        AlterTableDataColumnModel.deleteDataColumn({columnName}),
        CurrentValueModel.deleteAllParameterCurrentValues('vc', 0, parameter[0].id)
      ])
      return UserLogModel.insert(logData);
    } catch(error) {
      console.error(`Error deleting parameter: `, error);
    }
  }

}

module.exports = new VirtualChannelModel();