const db = require('@database');

class AlterTableColumn {

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

  insertColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const dataType = data.dataType
    const query = `ALTER TABLE ?? ADD ${columnName} ${dataType}`
    return this.executeQuery(query, [tableName]);
  }

  renameColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const newColumnName = data.newColumnName
    const dataType = data.dataType
    const query = `ALTER TABLE ?? CHANGE COLUMN ?? ?? ${dataType}`
    return this.executeQuery(query, [tableName, columnName, newColumnName]);
  }

  deleteColumn(data) {
    const tableName = data.tableName
    const columnName = data.columnName
    const query = `ALTER TABLE ?? DROP ${columnName}`
    return this.executeQuery(query, [tableName]);
  }
}

module.exports = new AlterTableColumn();