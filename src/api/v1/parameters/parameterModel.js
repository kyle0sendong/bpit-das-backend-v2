const ApiBaseModel = require("@api/ApiBaseModel");
const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");

class ParameterModel extends ApiBaseModel {

  constructor() {
    super('parameters');
  }

  getParametersByAnalyzerId(id) {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE tcp_analyzer_id = ?
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

module.exports = new ParameterModel();