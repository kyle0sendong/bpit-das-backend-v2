const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const ApiBaseModel = require("@api/ApiBaseModel");
const { toSnakeCase } = require("@utils/strings");
class ParameterBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName)
  }

  async insertParameter(dataArray, type) {
    const columns = Object.keys(dataArray[0]);
    const values = dataArray.map(item => columns.map(col => item[col]));
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES ?
    `;
    const insertColumnPromises = dataArray.map( (data) =>
      AlterTableDataColumnModel.insertDataColumn({
        columnName: toSnakeCase(`${data.name}_${type}${data.analyzer_id}`),
        dataType: 'decimal(10,5)'
      })
    )

    try {
      return await Promise.all([this.executeQuery(query, [values]), ...insertColumnPromises])
    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }

  async deleteParameter(id, type) {
    const parameter = await this.getById(id);

    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = ?
    `;

    try {
      await Promise.all([
        this.executeQuery(query, [id]),
        AlterTableDataColumnModel.deleteDataColumn({columnName: toSnakeCase(`${parameter[0].name}_${type}${parameter[0].analyzer_id}`)})
      ])
    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }

  }

  getParametersByAnalyzerId(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE analyzer_id = ?
    `
    return this.executeQuery(query, [id]);
  }

  async updateParameter(dataArray, type) {

    const updatePromises = dataArray.map(async (data) => {
      try {
        const parameter = await this.getById(data.id);
        if (data.name) {
          await AlterTableDataColumnModel.renameDataColumns({
            oldName: `${toSnakeCase(parameter[0].name)}_${parameter[0].analyzer_id}`,
            newName: `${toSnakeCase(data.name)}_${type}${parameter[0].analyzer_id}`,
            dataType: "decimal(10,5)",
          });
        }
        await this.update(data);
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