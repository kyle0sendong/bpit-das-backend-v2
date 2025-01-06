const db = require('@database');

module.exports = class Model {

    constructor(table) {
        this.table = table
    }

    getSite() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM ??', [this.table], (error, result) => {
                if(error) throw error;
                resolve(result)
            })
        })
    }

    getAllSiteName() {
        return new Promise((resolve, reject) => {
            db.query('SELECT name FROM ??', [this.table], (error, result) => {
                if(error) throw error;
                resolve(result)
            })
        })
    }

    updateSite(data) {
        return new Promise( (resolve, reject) => {
            db.query("UPDATE ?? SET ? WHERE id = ? ", [this.table, data, data.id], (error, result) => {
                if(error) throw error
                resolve(result)
            })
        })
    }

}