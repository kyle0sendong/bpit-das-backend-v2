const db = require('./database');

module.exports = new class AlterTableStructureModel {
 
  insertTable(data) {
    const query = 'CREATE TABLE ?? (datetime DATETIME)'
    return new Promise((resolve, reject) => {
      db.query (query, [data.tableName],
      (error, result) => {
        if(error) throw error;
        return resolve(result);
      })
    })
  }

  renameTable(data) {
    const query = `ALTER TABLE ?? RENAME TO ??`

    return new Promise( (resolve, result) => {
      db.query (query, [data.tableName, data.newTableName],
        (error, result) => {
          if(error) throw error;
          return resolve(result);
        })
    })
  }

  deleteTable(data) {
    const query = 'DROP TABLE ??'

    return new Promise((resolve, reject) => {
      db.query (query, [data.tableName],
      (error, result) => {
        if(error) throw error;
        return resolve(result);
      })
    })
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
