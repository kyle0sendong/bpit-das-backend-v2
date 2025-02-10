const ParameterBaseModel = require("../ParameterBaseModel");
const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const { toSnakeCase } = require("@utils/strings");
const UserLogModel = require("@apiV1/user-logs/UserLogModel");

class VirtualChannelModel extends ParameterBaseModel {
  constructor() {
    super("virtual_channels");
  }

  updateVirtualChannel(dataArray) {
    
    const columns = ['name', 'unit', 'enable', 'formula', 'x', 'y','z', 'a', 'b', 'c'];
    let sql = `UPDATE ${this.tableName} SET `;
    const values = [];
    const ids = [];
    dataArray.forEach(data => ids.push(data.id));

    columns.forEach( column => {
      const hasColumn = dataArray.some((data) => data[column] !== undefined)

      if (hasColumn) {
        sql += `${column} = CASE `
        dataArray.forEach( (data) => {
          if(data[column] != undefined) {
            sql += `WHEN id = ? THEN ? `
            values.push(data.id, data[column])
          }
        })
        sql += `ELSE ${column} END, `
      }
    });

    sql = sql.slice(0, -2);
    sql += ` WHERE id IN (${ids})`

    return this.executeQuery(sql, values)

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
      const columnName = toSnakeCase(`${parameterDetails[0].name}`)
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