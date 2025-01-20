const ParameterBaseModel = require("@api/ParameterBaseModel");

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
}

module.exports = new VirtualChannelModel();