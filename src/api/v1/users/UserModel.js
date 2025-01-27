const ApiBaseModel = require("@api/ApiBaseModel");

class UserModel extends ApiBaseModel {
  constructor() {
    super("users");
    this.rolesTable = "user_roles"
  }

  async getUserByUsername(username) {
    const query = `
      SELECT
        ${this.tableName}.id,
        ${this.tableName}.username,
        ${this.tableName}.email,
        ${this.tableName}.password,
        ${this.tableName}.first_name,
        ${this.tableName}.last_name,
        ${this.rolesTable}.role
      FROM ${this.tableName}
      INNER JOIN ${this.rolesTable} ON ${this.tableName}.role_id = ${this.rolesTable}.id
      WHERE username = ?
    `;

    const results = await this.executeQuery(query, [username]);
    return results.length > 0 ? results[0] : null;
  }

  loginUser() {

  }

  logOut() {

  }

  updateUser() {

  }


}

module.exports = new UserModel();