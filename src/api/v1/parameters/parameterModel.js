const db = require('@database');

module.exports = class Model {

    constructor() {
        this.table = 'parameters';
    }

    // Schema: enable, function_code, start_register_address, end_register_address, correction_factor_mult, correction_factor_add, comm_id
    insertParameter(data) {
        const query = 'INSERT INTO ?? (name, unit, enable, request_interval, format, function_code, start_register_address, register_count, formula, tcp_analyzer_id) VALUES (?,?,?,?,?,?,?,?,?,?)'
        return new Promise( (resolve, reject) => {
            db.query(query,
                [this.table, data.name, data.unit, data.enable, data.request_interval, data.format, data.function_code, data.start_register_address, data.register_count, data.formula, data.tcp_analyzer_id],
                (error, result) => {
                    if(error) throw error;
                    resolve(result)
            })
        })
    }

    getParameter(id) {
        const query = 'SELECT * FROM ?? WHERE tcp_analyzer_id = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, id], (error, result) => {
                if (error) throw error
                resolve(result)
            })
        })
    }

    getAllParameter() {
        const query = 'SELECT * FROM ??'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table], (error, result) => {
                if(error) throw error;
                resolve(result);
            })
        })
    }

    updateParameter(data) {
        const query = 'UPDATE ?? SET ? WHERE id = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, data, data.id], (error, result) =>{
                if(error) throw error;
                resolve(result);
            })
        })
    }

    deleteParameter(id) {
        const query = 'DELETE FROM ?? WHERE id = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, id], (error, result) => {
                if(error) throw error;
                resolve(result);
            })
        })
    }
}
