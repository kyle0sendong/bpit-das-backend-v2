const db = require("@database");
const ApiBaseModel = require("@api/ApiBaseModel");

class CurrentValuesModel extends ApiBaseModel {

  constructor() {
   super('current_values');
  }

  getCurrentValuesByTcpId = (id) => {
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
}

module.exports = new CurrentValuesModel();