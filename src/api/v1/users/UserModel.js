const ApiBaseModel = require("@api/ApiBaseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserModel extends ApiBaseModel {
  constructor() {
    super("users");
    this.rolesTable = "user_roles";
    this.blacklistedTokenTable = "blacklisted_tokens";
  }

  async getUserRoles() {
    const query = `
      SELECT *
      FROM ${this.rolesTable}
    `;
    return this.executeQuery(query);
  }
  
  async getAllUsers() {
    const query = `
      SELECT
        CONCAT(first_name, ' ', last_name) AS name,
        ${this.tableName}.id,
        ${this.tableName}.username,
        ${this.tableName}.email,
        ${this.tableName}.first_name AS firstName,
        ${this.tableName}.last_name AS lastName,
        ${this.rolesTable}.role,
        ${this.rolesTable}.id AS roleId
      FROM ${this.tableName}
      INNER JOIN ${this.rolesTable} ON ${this.tableName}.role_id = ${this.rolesTable}.id
    `;

    const results = await this.executeQuery(query);
    return results.length > 0 ? results : null;
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

  async getUserById(id) {

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
      WHERE ${this.tableName}.id = ?
    `;
    const results = await this.executeQuery(query, [id]);
    return results.length > 0 ? results[0] : null;
  }


  async login(data) {

    // Check if user exists
    const user = await this.getUserByUsername(data.username);

    if (!user) {
      return { code: 401, json: {message: "Invalid username or password"}}
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return { code: 401, json: {message: "Invalid username or password"}}
    }

    const userData = {
      name: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
      username: user.username,
      email: user.email,
      role: user.role
    }

    // Generate JWT token
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return { code: 200, json: {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    }}
  }

  async updateUser(newData) {

    await this.update(newData);
    //create user data
    const updateData = await this.getUserById(newData.id);

    for(let column of Object.keys(newData)) {
      if(column == "id") continue;
      updateData[column] = newData[column]
    }

    // Generate JWT token
    const user = {
      id: updateData.id,
      firstName: updateData.first_name,
      lastName: updateData.last_name,
      username: updateData.username,
      email: updateData.email,
      role: updateData.role,
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return { code: 200, json: {
      message: "Login successful",
      token,
      user
    }};
  }

  async register(data) {
    // Check if user already exists
    const existingUser = await this.getUserByUsername(data.username);
    if (existingUser) {
      return { code: 400, json: {message: "Username already exists"}}
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    // Create user object
    const user = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      first_name: data.firstName,
      last_name: data.lastName,
    };
  
    // Insert user into the database
    await UserModel.insert(user);
    return { code: 201, json: {message: "User registered successfully"}};
  }

  async logOut(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const query = `
      INSERT INTO ${this.blacklistedTokenTable} (token, expires_at) VALUES (?, ?)
    `;
    return await this.executeQuery(query, [token, new Date(decoded.exp * 1000)]);
  }

}

module.exports = new UserModel();