const db = require('@database');

class AlterTable {

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
  
  insertTable(data) {
    const query = 'CREATE TABLE ?? (datetime DATETIME)'
    this.executeQuery(query, [data.tableName]);
  }

  renameTable(data) {
    const query = `ALTER TABLE ?? RENAME TO ??`
    this.executeQuery(query, [data.tableName, data.newTableName]);
  }

  deleteTable(data) {
    const query = 'DROP TABLE ??'
    this.executeQuery(query, [data.tableName]);
  }

  insertColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const dataType = data.dataType
    const query = `ALTER TABLE ?? ADD ${columnName} ${dataType}`
    
    return new Promise( (resolve, result) => {
      db.query(query, [tableName],
        (error, result) => {
          if(error) throw error;
          return resolve(result);
        })
    })
  }

  renameColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const newColumnName = data.newColumnName
    const dataType = data.dataType
    const query = `ALTER TABLE ?? CHANGE COLUMN ?? ?? ${dataType}`

    return new Promise( (resolve, result) => {
      db.query(query, [tableName, columnName, newColumnName], 
        (error, result) => {
          if(error) throw error;
          return resolve(result);
        })
    })
  }

  deleteColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const query = `ALTER TABLE ?? DROP ${columnName}`
    
    return new Promise( (resolve, result) => {
      db.query(query, [tableName],
        (error, result) => {
          if(error) throw error;
          return resolve(result);
        })
    })
  }
}

module.exports = new AlterTable();