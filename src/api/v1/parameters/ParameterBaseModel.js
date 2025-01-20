const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const ApiBaseModel = require("@api/ApiBaseModel");

class ParameterBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName)
  }

  getParametersByAnalyzerId(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE analyzer_id = ?
    `
    return this.executeQuery(query, [id]);
  }

  getParameterById(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE id = ?
    `
    return this.executeQuery(query, [id]);
  }

  async updateParameter(dataArray) {
    for (const data of dataArray) {
      try {
        if(data.name) {
          const parameter = await this.getParameterById(data.id);
          await AlterTableDataColumnModel.renameDataColumns({
            oldName: `${parameter[0].name}_${data.id}`,
            newName: `${data.name}_${data.id}`,
            dataType: 'decimal(10,5)'
          });
        }
        await this.update(data);
      } catch (error) {
        console.error(`Error updating parameter with ID ${data.id}:`, error);
      }
    }
  }
  
  
}

module.exports = ParameterBaseModel;