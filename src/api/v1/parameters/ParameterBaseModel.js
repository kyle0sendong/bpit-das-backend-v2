const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const ApiBaseModel = require("@api/ApiBaseModel");
const { toSnakeCase } = require("@utils/strings");
const TcpAnalyzerModel = require("@apiV1/analyzers/tcp/TcpAnalyzerModel");
const UserLogModel = require("@apiV1/user-logs/UserLogModel");

class ParameterBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName)
    this.tcpAnalyzerTable = TcpAnalyzerModel.getTableName();
  }

  getParameterDetailsById(id) {
    const query = `
      SELECT
        ${this.tableName}.name,
        ${this.tableName}.unit,
        ${this.tableName}.enable,
        ${this.tableName}.request_interval,
        ${this.tableName}.format,
        ${this.tableName}.function_code,
        ${this.tableName}.start_register_address,
        ${this.tableName}.register_count,
        ${this.tableName}.formula,
        ${this.tableName}.analyzer_id,
        ${this.tcpAnalyzerTable}.name AS analyzer_name
      FROM ${this.tableName}
      INNER JOIN ${this.tcpAnalyzerTable} ON ${this.tableName}.analyzer_id = ${this.tcpAnalyzerTable}.id
      WHERE ${this.tableName}.id = ?
    `;
    return this.executeQuery(query, [id]);
  }

  getParametersByAnalyzerId(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE analyzer_id = ?
    `
    return this.executeQuery(query, [id]);
  }

  async insertParameter(dataArray, type, user, numberOfParameter, analyzerId = 0) {

    const columns = Object.keys(dataArray[0]);
    const values = dataArray.map(item => columns.map(col => item[col]));
    const analyzerDetails = await TcpAnalyzerModel.getById(analyzerId);

    // process log data
    const logData = {
      username: user.username,
      full_name: user.name,
      tags: "Parameter, Insert",
      changes: `Inserted ${numberOfParameter} parameter to '${type == "vc" ? 'Virtual Channels' : analyzerDetails[0].name}'`
    };
    
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES ?
    `;

    // for batch insert, use promise all
    const insertColumnPromises = dataArray.map( (data) => {
      const columnName = 
        type == "vc" ? 
          toSnakeCase(`${type}_${data.name}`) :
          toSnakeCase(`${type}${data.analyzer_id}_${data.name}`);

      return AlterTableDataColumnModel.insertDataColumn({
        columnName: columnName,
        dataType: 'decimal(10,5)'
      })
    })

    try {
      await Promise.all([this.executeQuery(query, [values]), ...insertColumnPromises]);
      return UserLogModel.insert(logData);
    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }

  async deleteParameter(id, type, user) {

    const parameterDetails = await this.getParameterDetailsById(id);
    const analyzerDetails = await TcpAnalyzerModel.getById(parameterDetails[0].analyzer_id ?? 0);

    const logData = {
      username: user.username,
      full_name: user.name,
      tags: "Parameter, Delete",
      changes: `Deleted parameter '${parameterDetails[0].name}' from '${analyzerDetails[0].name}'`
    };

    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = ?
    `;

    try {
      // delete columns from data tables
      const columnName = toSnakeCase(`${type}${parameterDetails[0].analyzer_id}_${parameterDetails[0].name}`);
      await Promise.all([
        this.executeQuery(query, [id]),
        AlterTableDataColumnModel.deleteDataColumn({columnName})
      ])
      return UserLogModel.insert(logData);
    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }

  async updateParameter(dataArray, type) {

    const updatePromises = dataArray.map(async (data) => {
      try {
        const parameter = await this.getById(data.id);
        if (data.name) {
          let oldName = `${type}_${toSnakeCase(parameter[0].name)}`;
          let newName = `${type}_${toSnakeCase(data.name)}`;

          if(type != "vc") {
            oldName = `${type}${parameter[0].analyzer_id}_${toSnakeCase(parameter[0].name)}`;
            newName = `${type}${parameter[0].analyzer_id}_${toSnakeCase(data.name)}`;
          }
          
          await AlterTableDataColumnModel.renameDataColumns({
            oldName: oldName,
            newName: newName,
            dataType: "decimal(10,5)",
          });
        }
        return await this.update(data);
      } catch (error) {
        console.error(`Error updating parameter with ID ${data.id}:`, error);
        throw error;
      }
    });
  
    try {
      return await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating one or more parameters:", error);
    }
  }
  
}

module.exports = ParameterBaseModel;