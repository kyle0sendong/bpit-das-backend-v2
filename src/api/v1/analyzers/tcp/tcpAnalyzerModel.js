const db = require('@database');

module.exports = class Model {

    constructor() {
        this.table = 'tcp_analyzers';
    }

    getTcpAnalyzer(id) {
        const query = 'SELECT * FROM ?? WHERE id = ?';
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, id], (error, result) => {
                if(error) throw error;
                resolve(result)
            })
        })
    }

    getAll() {
        const query = 'SELECT * FROM ??'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table], (error, result) => {
                if(error) throw error;
                resolve(result)
            })
        })
    }

    async getTcpWithParameters(id) {
        const query = `SELECT tcp_analyzer.name, parameter.id, parameter.name FROM ??
        INNER JOIN ?? ON parameter.id = tcp_analyzer.?`

        try {
            const result = db.query(query, [this.table, 'parameter', id])
            return result 
        } catch (error) {
            throw error
        }
    }

    // Schema: name, host_address, port, device_address, sampling
    insertTcpAnalyzer(data) {
        const query = 'INSERT INTO ?? (name, host_address, port, device_address, sampling) VALUES (?,?,?,?,?)'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, data.name, data.host_address, data.port, data.device_address, data.sampling], (error, result) => {
                if(error) throw error;
                resolve(result)
            })
        })
    }

    updateTcpAnalyzer(data) {
        const query = 'UPDATE ?? SET ? WHERE id = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, data, data.id], (error, result) => {
                if(error) throw error;
                resolve(result);
            })
        })
    }

    deleteTcpAnalyzer(id) {
        const query = 'DELETE FROM ?? WHERE id = ?'
        return new Promise( (resolve, reject) => {
            db.query(query, [this.table, id], (error, result) => {
                if(error) throw error;
                resolve(result);
            })
        })
    }

}