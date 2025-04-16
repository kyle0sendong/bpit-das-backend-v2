const ApiBaseModel = require("../../ApiBaseModel.js");

class TimebaseModel extends ApiBaseModel {
  constructor() {
    super('timebases');
  }

  getAllTimebases() {
    const query = `
      SELECT *
      FROM ${this.tableName}
      ORDER BY timebase ASC
    `;
    return this.executeQuery(query);
  }

  async getTimebaseIdByTimebase(timebase) {
    const query = `
      SELECT id
      FROM ${this.tableName}
      WHERE timebase = ?
    `;
    const result = await this.executeQuery(query, [timebase]);
    return result[0].id;
  }

  getEnabledTimebase() {
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE enable = 1
    `;
    return this.executeQuery(query);
  }

  updateTimebase(dataArray) {
    const columns = ['timebase', 'enable'];
    let sql = `UPDATE ${this.tableName} SET `;
    const values = [];
    const timebases = [];
    dataArray.forEach(data => timebases.push(data.timebase));

    columns.forEach( column => {
      const hasColumn = dataArray.some((data) => data[column] !== undefined)

      if (hasColumn) {
        sql += `${column} = CASE `
        dataArray.forEach( (data) => {
          if(data[column] != undefined) {
            sql += `WHEN timebase = ? THEN ? `
            values.push(data.timebase, data[column])
          }
        })
        sql += `ELSE ${column} END, `
      }
    });

    sql = sql.slice(0, -2);
    sql += ` WHERE timebase IN (${timebases})`

    return this.executeQuery(sql, values)
  }

}

module.exports = new TimebaseModel();