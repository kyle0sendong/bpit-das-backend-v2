
const { toSnakeCase } = require("@utils/strings");

const ApiBaseModel = require("@api/ApiBaseModel");

const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const TcpAnalyzerModel = require("@apiV1/analyzers/tcp/TcpAnalyzerModel");
const SerialAnalyzerModel = require("@apiV1/analyzers/serial/SerialAnalyzerModel");
const CurrentValueModel = require("@apiV1/current-values/CurrentValueModel");
const UserLogModel = require("@apiV1/user-logs/UserLogModel");

class ParameterBaseModel extends ApiBaseModel {


  constructor(tableName) {
    super(tableName)
    this.tcpAnalyzerTable = 'tcp_analyzers';
    this.serialAnalyzerTable = 'serial_analyzers';
  }


  getParameterDetailsById(id, type) {

    const analyzerTable = type === 'tcp' ? this.tcpAnalyzerTable : this.serialAnalyzerTable;

    const query = `
      SELECT
        ${this.tableName}.name,
        ${this.tableName}.id,
        ${this.tableName}.analyzer_id as analyzerId,
        ${analyzerTable}.name AS analyzerName
      FROM ${this.tableName}
      INNER JOIN ${analyzerTable} ON ${this.tableName}.analyzer_id = ${analyzerTable}.id
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
    try {
      const columns = Object.keys(dataArray[0]);
      const values = dataArray.map(item => columns.map(col => item[col]));

      let analyzerDetails;
      if(type == "tcp") {
        analyzerDetails = await TcpAnalyzerModel.getById(analyzerId);
      } else if(type == "serial") {
        analyzerDetails = await SerialAnalyzerModel.getById(analyzerId);
      } else {
        analyzerDetails = [{name: 'Virtual Channels'}];
      }

      const logData = {
        username: user.username,
        full_name: user.name,
        tags: "Parameter, Insert",
        changes: `Inserted ${numberOfParameter} parameter to '${analyzerDetails[0].name}'`
      };

      const query = `
        INSERT INTO ${this.tableName} (${columns.join(", ")})
        VALUES ?
      `;

      const insertColumnPromises = dataArray.map((data) => {
        const columnName = 
          type == "vc" ? 
            toSnakeCase(`${type}_${data.name}`) :
            toSnakeCase(`${type}${data.analyzer_id}_${data.name}`);
        return AlterTableDataColumnModel.insertDataColumn({
          columnName: columnName,
          dataType: 'decimal(10,5)'
        })
      });

      await Promise.all([this.executeQuery(query, [values]), ...insertColumnPromises]);
      return UserLogModel.insert(logData);

    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }


  async deleteParameter(id, type, user) {
    try {
      const parameter = await this.getParameterDetailsById(id, type);
      let analyzerDetails;
      if(type == "tcp") {
        analyzerDetails = await TcpAnalyzerModel.getById(parameter[0].analyzerId);
      } else if(type == "serial") {
        analyzerDetails = await SerialAnalyzerModel.getById(parameter[0].analyzerId);
      }

      const logData = {
        username: user.username,
        full_name: user.name,
        tags: "Parameter, Delete",
        changes: `Deleted parameter '${parameter[0].name}' from '${analyzerDetails[0].name}'`
      };
  
      const query = `
        DELETE FROM ${this.tableName}
        WHERE id = ?
      `;

      const columnName = toSnakeCase(`${type}${parameter[0].analyzerId}_${parameter[0].name}`);
      await Promise.all([
        this.executeQuery(query, [id]),
        AlterTableDataColumnModel.deleteDataColumn({columnName}),
        CurrentValueModel.deleteAllParameterCurrentValues(type, parameter[0].id, parameter[0].analyzerId)
      ]);
      return UserLogModel.insert(logData);

    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }


  async updateParameter(dataArray, type, user) {

    // Create array of promises
    const updatePromises = dataArray.map(async (data) => {
      try {

        const parameter = await this.getById(data.id);
        
        // Process Log changes and tags
        let changes = `Updated '${parameter[0].name}' from `;
        let tags = "";
        if(type == "vc") {
          changes += `'Virtual Channels'`;
          tags = "Virtual Channel, Update";
        } else if(type =="tcp") {
          const analyzerDetails = await TcpAnalyzerModel.getById(parameter[0].analyzer_id ?? 0);
          tags = "Modbus TCP, Update";
          changes += `'${analyzerDetails[0].name}' `
        } else if(type == 'serial') {
          const analyzerDetails = await SerialAnalyzerModel.getById(parameter[0].analyzer_id ?? 0);
          tags = "Serial, Update";
          changes += `'${analyzerDetails[0].name}' `
        }

        for(let column of Object.keys(data)) {
          if(column == "id") continue;
          changes += `(${column}: '${parameter[0][column]}' to '${data[column]}') `
        }

        // Process log data
        const logData = {
          username: user.username,
          full_name: user.name,
          tags: tags,
          changes: changes.trimEnd()
        };

        // When 'name' is changed, update table and data table columns
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

        await this.update(data);
        return UserLogModel.insert(logData);

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