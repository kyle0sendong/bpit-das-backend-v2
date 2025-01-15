const ApiBaseModel = require("@api/ApiBaseModel");

class TimebaseModel extends ApiBaseModel {
  constructor() {
    super('timebases');
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