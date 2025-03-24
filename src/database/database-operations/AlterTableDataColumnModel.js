const TimebaseModel = require("@api/v1/timebases/TimebaseModel");
const db = require("@database");

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
    
    const timebases = await TimebaseModel.getAllTimebases();
    const queries = timebases.map((timebase) => {
      if (timebase.timebase === 0) return null;
      const tableName = `data_t${timebase.timebase}`;
      const query = `
        ALTER TABLE ${tableName} DROP ${data.columnName}
      `;
      return this.executeQuery(query);
    });
    return await Promise.all(queries);
  }
  
}

module.exports = new AlterTableDataColumnModel();