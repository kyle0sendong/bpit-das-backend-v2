const AlterTableDataColumnModel = require("@databaseOperations/AlterTableDataColumnModel");
const ApiBaseModel = require("@api/ApiBaseModel");

class ParameterBaseModel extends ApiBaseModel {

  constructor(tableName) {
    super(tableName)
  }

  async insertParameter(dataArray) {
    const columns = Object.keys(dataArray[0]);
    const values = dataArray.map(item => columns.map(col => item[col]));
    const query = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES ?
    `;
    const insertColumnPromises = dataArray.map( (data) =>
      AlterTableDataColumnModel.insertDataColumn({
        columnName: data.name,
        dataType: 'decimal(10,5)'
      })
    )

    try {
      return await Promise.all([this.executeQuery(query, [values]), ...insertColumnPromises])
    } catch(error) {
      console.error(`Error inserting parameter: `, error);
    }
  }

  async deleteParameter(id) {
    const parameter = await this.getById(id);

    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = ?
    `;

    try {

      await Promise.all([
        this.executeQuery(query, [id]),
        AlterTableDataColumnModel.deleteDataColumn({columnName: parameter[0].name})
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

  async updateParameter(dataArray) {
    for (const data of dataArray) {
      try {
        if(data.name) {
          const parameter = await this.getById(data.id);
          await AlterTableDataColumnModel.renameDataColumns({
            oldName: `${parameter[0].name}_${data.id}`,
            newName: `${data.name}_${data.id}`,
            dataType: 'decimal(10,5)'
          });
        }
        return await this.update(data);
      } catch (error) {
        console.error(`Error updating parameter with ID ${data.id}:`, error);
      }
    }
  }
  
  
}

module.exports = ParameterBaseModel;