const db = require("../database/database.js");

class BaseApiModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

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

  getTableName() {
    return this.tableName;
  }
  
  getAll() {
    const query = `
      SELECT *
      FROM ${this.tableName}
    `;
    return this.executeQuery(query);
  }

  getById(id) {
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE id = ?
    `;
    return this.executeQuery(query, [id]);
  }

  insert(data) {
    const query = `
      INSERT INTO ${this.tableName}
      SET ?
    `;
    return this.executeQuery(query, [data]);
  }

  update(data) {
    const query = `
      UPDATE ${this.tableName}
      SET ?
      WHERE id = ?
    `;
    return this.executeQuery(query, [data, data.id]);
  }
  
  delete(id) {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = ?
    `;
    return this.executeQuery(query, [id]);
  }

}

module.exports = BaseApiModel;