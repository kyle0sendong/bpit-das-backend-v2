const db = require('@database');

module.exports = class Model {

  constructor(table) {
      this.table = table
  }

  insertLog(data) {
    const query = 'INSERT INTO ?? (username, full_name, date, time, tags, changes) VALUES (?,?,?,?,?,?)'
    return new Promise( (resolve, reject) => {
      db.query(query, [this.table, data.username, data.full_name, data.date, data.time, data.tags, data.changes], (error, result) => {
          if(error) throw error;
          resolve(result)
      })
    })
  }

  getLatestLog() {
    const query = 'SELECT * FROM ?? WHERE id = (SELECT MAX(id) FROM ??)'
    return new Promise ( (resolve, reject) => {
      db.query(query, [this.table, this.table],
        (error, result) => {
          if(error) throw error;
          resolve(result)
        })
    })
  }
  
  getLog(data) {
    const query = 'SELECT * FROM ?? WHERE date = ?'
    return new Promise( (resolve, reject) => {
      db.query(query, [this.table, data.date], (error, result) => {
          if(error) throw error;
          resolve(result);
      })
    })
  }

  getLogDateRange(data) {
    const query = 'SELECT * FROM ?? WHERE date >= ? and date <= ?'
    return new Promise( (resolve, reject) => {
      db.query(query, [this.table, data.startDate, data.endDate], (error, result) => {
          if(error) throw error;
          resolve(result);
      })
    })
  }

  getDistinctDateLogs() {
    const query = 'SELECT DISTINCT date FROM ??'
    return new Promise( (resolve, reject) => {
      db.query(query, [this.table], (error, result)=> {
        if(error) throw error
        resolve(result)
      })
    })
  }
}