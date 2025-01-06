const db = require('@database');

module.exports = class Model {

    constructor(table) {
        this.table = 'timebases'
    }

    // Schema: timebase
    insertTimebase(data) {
        const query = 'INSERT INTO ?? (enable, timebase, custom) VALUES (?, ?, ?)'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, data.enable, data.timebase, data.custom], (error, result) => {
                if(error) throw error;
                resolve(result)
            })
        })
    }

    getAllTimebase() {
        const query = 'SELECT * FROM ??'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table], (error, result) => {
                if(error) throw error;
                resolve(result);
            })
        })
    }

    updateTimebase(data) {
        const query = 'UPDATE ?? SET ? WHERE timebase = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, data, data.timebase], (error, result) =>{
                if(error) throw error;
                resolve(result);
            })
        })
    }

    deleteTimebase(data) {
        const query = 'DELETE FROM ?? WHERE timebase = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, data.timebase], (error, result) => {
                if(error) throw error;
                resolve(result);
            })
        })
    }
}