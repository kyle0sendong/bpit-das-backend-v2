const db = require("@database");

module.exports = class Model {

  constructor() {
    this.table = 'current_values';
  }

  getAllCurrentValuesTcp = (id) => {
    const query = "SELECT * FROM ?? WHERE tcp_id = ?"
    return new Promise( (resolve,result) => {

      db.query(
        query,
        [this.table, id],
        (error, result) => {
          if(error) throw error
          resolve(result)
        }
      )
    })
  }

  getAllCurrentValues = () => {
    const query = "SELECT * FROM ??"
    return new Promise( (resolve,result) => {
      db.query(
        query,
        [this.table],
        (error, result) => {
          if(error) throw error
          resolve(result)
        }
      )
    })
  }

  insertCurrentValue = (data) => {
    const query = "INSERT INTO ?? (current_value, current_value_status, datetime, tcp_id, timebase_id, parameter_id, derived_parameter_id) VALUES (?,?,?,?,?,?,?)"
    return new Promise( (resolve, reject) => {
      db.query(
        query,
        [this.table, data.current_value, data.current_value_status, data.datetime, data.tcp_id, data.timebase_id, data.parameter_id, data.derived_parameter_id],
        (error, result) => {
          if(error) throw error
          resolve(result)
        }
      )
    })
  }

  updateCurrentValue = (data) => {
    const query = "UPDATE ?? SET ? WHERE id = ?"
    return new Promise( (resolve, reject) => {
      db.query(
        query,
        [this.table, data, data.id],
        (error, result) => {
          if(error) throw error
          resolve(result)
        }
      )
    })
  }
}