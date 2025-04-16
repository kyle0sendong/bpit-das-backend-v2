const ApiBaseModel = require("../../ApiBaseModel.js");
const TimebaseModel = require("../timebases/TimebaseModel.js");

class CurrentValuesModel extends ApiBaseModel {

  constructor() {
    super('current_values');
    this.tcpParameterTableName = 'tcp_parameters';
    this.serialParameterTableName = 'serial_parameters';
    this.virtualChannelTableName = 'virtual_channels';
    this.timebaseTableName = 'timebases';
  }

  checkCurrentValueExist = async (parameterId, analyzerType, analyzerId, timebaseId) => {
    const query = `
      SELECT * 
      FROM ${this.tableName} 
      WHERE 
        parameter_id = ? 
        AND ${analyzerType}_id = ?
        AND timebase_id = ?
    `

    const result = await this.executeQuery(query, [parameterId, analyzerId, timebaseId]);
    
    if(result[0]) return true;
    else return false;
  }

  getCurrentValuesByAnalyzerId = async (id, type) => {

    const parameterTableName = type === 'tcp' ? this.tcpParameterTableName : type === 'serial' ? this.serialParameterTableName : this.virtualChannelTableName;

    let query = '';

    if(type !== 'vc') {
      query = `
        SELECT
          ${this.tableName}.id,
          ${this.tableName}.current_value AS currentValue,
          ${this.tableName}.datetime,
          ${this.timebaseTableName}.timebase,
          ${parameterTableName}.name AS parameterName,
          ${parameterTableName}.request_interval AS requestInterval
        FROM ${this.tableName}
        INNER JOIN ${parameterTableName} ON ${this.tableName}.parameter_id = ${parameterTableName}.id
        INNER JOIN ${this.timebaseTableName} ON ${this.tableName}.timebase_id = ${this.timebaseTableName}.id
        WHERE ${type}_id = ? 
          AND ${parameterTableName}.enable = 1 
          AND ${this.timebaseTableName}.enable = 1
      `;
    } else {
      query = `
        SELECT
          ${this.tableName}.id,
          ${this.tableName}.current_value AS currentValue,
          ${this.tableName}.datetime,
          ${this.timebaseTableName}.timebase,
          ${parameterTableName}.name AS parameterName
        FROM ${this.tableName}
        INNER JOIN ${parameterTableName}
        INNER JOIN ${this.timebaseTableName} ON ${this.tableName}.timebase_id = ${this.timebaseTableName}.id
        WHERE vc_id != 0 AND ${parameterTableName}.enable = 1 AND ${this.timebaseTableName}.enable = 1
      `;
    }

    const result = await this.executeQuery(query, [id])
    return result;
  }

  updateCurrentValue = (data, type) => {
    const query = `
      UPDATE  ${this.tableName}
      SET ?
      WHERE 
        ${type}_id = ${data.analyzerId} AND 
        parameter_id = ${data.parameterId} AND 
        timebase_id = ${data.timebaseId}
    `;
    return this.executeQuery(query, [data.data]);
  }

  getCurrentValue = async (data, type) => {
    const query = `
      SELECT *
      FROM ${this.tableName}
      WHERE
        ${type}_id = ${data.analyzerId} AND 
        parameter_id = ${data.parameterId} AND 
        timebase_id = ${data.timebaseId}
    `
    return this.executeQuery(query);
  }

  async deleteAllParameterCurrentValues(type, parameterId, analyzerId) {
    if(type === 'vc') parameterId = 0;
    const timebases = await TimebaseModel.getAllTimebases();
    const queries = timebases.map(async (timebase) => {
      const currentValue = await this.getCurrentValue({timebaseId: timebase.id, parameterId, analyzerId}, type);
      if(currentValue.length > 0) return await this.delete(currentValue[0].id);
      return null;
    });
    return await Promise.all(queries);
  }

}

module.exports = new CurrentValuesModel();