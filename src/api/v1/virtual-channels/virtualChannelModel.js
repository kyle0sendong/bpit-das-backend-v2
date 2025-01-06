const db = require('@database');

module.exports = class Model {

  constructor(table) {
    this.table = table
  }
  
  async insertDerivedParameter(data) {
    const query = "INSERT INTO ?? (tcp_analyzer_id, name, unit) VALUES (?,?,?)"
    try {
      const result = db.query(query, [this.table, data.tcp_analyzer_id, data.name, data.unit])
      return result
    } catch(error) {
      throw error
    }
  }

  getDerivedParameter(id) {
    const query = "SELECT * FROM ?? WHERE tcp_analyzer_id = ?"
    return new Promise( (resolve, reject) => {
      db.query(query,
        [this.table, id],
        (error, result) => {
          if(error) throw error
          resolve(result)
        }
      )
    })
  }

  getAllDerivedParameter() {
    const query = "SELECT * FROM ??"
    return new Promise( (resolve, reject) => {
      db.query(query,
        [this.table],
        (error, result) => {
          if(error) throw error
          resolve(result)
        }
      )
    })
  }

  updateDerivedParameter(data) {
    const query = "UPDATE ?? SET ? WHERE id = ?"
    return new Promise( (resolve, reject) => {
      db.query(query,
        [this.table, data, data.id],
        (error, result) => {
          if (error) throw error
          resolve(result)
        }
      )
    })
  }

  async deleteDerivedParameter(id) {
    const query = "DELETE FROM ?? WHERE id = ?"
    try {
      const result = db.query(query, [this.table, id])
      return result
    } catch (error) {
      throw error
    }
  }

}