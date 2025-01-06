const db = require("@database");

class BaseApiModel {
  constructor(table) {
    this.table = table;
  }

  executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      db.query(query, params, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  getAll() {
    const query = `
      SELECT *
      FROM ${this.table}
    `;
    return this.executeQuery(query);
  }

  getAllById(id) {
    const query = `
      SELECT *
      FROM ${this.table}
      WHERE id = ?
    `;
    return this.executeQuery(query, [id]);
  }

  insert(data) {
    const query = `
      INSERT INTO ${this.table}
      SET ?
    `;
    return this.executeQuery(query, [data]);
  }

  update(id) {
    const query = `
      UPDATE ${this.table}
      SET ?
      WHERE id = ?
    `;
    return this.executeQuery(query, [id]);
  }
  
  delete(id) {
    const query = `
      DELETE FROM ${this.table}
      WHERE id = ?
    `;
    return this.executeQuery(query, [id]);
  }


}

module.exports = BaseApiModel;