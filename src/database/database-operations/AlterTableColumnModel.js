const TimebaseModel = require("@api/v1/timebases/TimebaseModel");
const db = require("@database");

class AlterTableColumnModel {

  executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      db.query(
        query, 
        params, 
        (error, result) => {
        if (error) reject(error);
        resolve(result);
        }
      );
    });
  }

  async renameDataColumns(dataArray) {
    const timebases = await TimebaseModel.getAllTimebases();
    const queries = timebases.map((timebase) => {
      const tableName = `data_t${timebase.timebase}`;
      const query = `
        ALTER TABLE ${tableName} 
        CHANGE COLUMN ${dataArray.oldName} ${dataArray.newName} ${dataArray.dataType}
      `;
      return this.executeQuery(query);
    });
    await Promise.all(queries);
  }
  
  insertColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const dataType = data.dataType
    const query = `ALTER TABLE ?? ADD ${columnName} ${dataType}`
    return this.executeQuery(query, [tableName]);
  }
  
  deleteColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const query = `ALTER TABLE ?? DROP ${columnName}`
    return this.executeQuery(query, [tableName]);
  }
  
}

module.exports = new AlterTableColumnModel();