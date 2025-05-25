const TimebaseModel = require("../../api/v1/timebases/TimebaseModel.js");
const db = require("../database.js");

class AlterTableDataColumnModel {

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
      if (timebase.timebase === 0) return null;
      const tableName = `data_t${timebase.timebase}`;
      const query = `
        ALTER TABLE ${tableName} 
        CHANGE COLUMN ${dataArray.oldName} ${dataArray.newName} ${dataArray.dataType}
      `;
      return this.executeQuery(query);
    });
    return await Promise.all(queries);
  }
  
  async insertDataColumn(data) {
    const timebases = await TimebaseModel.getAllTimebases();
    const queries = timebases.map((timebase) => {
      if (timebase.timebase === 0) return null;
      const tableName = `data_t${timebase.timebase}`;
      const query = `
        ALTER TABLE ${tableName} ADD ${data.columnName} ${data.dataType}
      `;
      return this.executeQuery(query);
    });
    return await Promise.all(queries);
  }
  
  async deleteDataColumn(data) {
    // Accept a single column or an array of columns
    const columnList = Array.isArray(data.columnName)
      ? data.columnName
      : [data.columnName];

    const safeCols = columnList.map(
      (col) => `\`${col.toLowerCase()}\``
    );

    const timebases = await TimebaseModel.getAllTimebases();

    const queries = timebases
      .filter((t) => t.timebase !== 0)
      .flatMap((t) => {
        const tableName = `\`data_t${t.timebase}\``;
        return safeCols.map((col) =>
          this.executeQuery(`ALTER TABLE ${tableName} DROP COLUMN ${col}`)
        );
      });

    return Promise.all(queries);
  }

  
}

module.exports = new AlterTableDataColumnModel();