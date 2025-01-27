const ApiBaseModel = require("@api/ApiBaseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserModel extends ApiBaseModel {
  constructor() {
    super("users");
    this.rolesTable = "user_roles";
    this.blacklistedTokenTable = "blacklisted_tokens";
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

  async login(data) {

    // Check if user exists
    const user = await this.getUserByUsername(data.username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });


    // Return response
    return {
      message: "Login successful",
      jwtToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logOut(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const query = `
      INSERT INTO ${this.blacklistedTokenTable} (token, expires_at) VALUES (?, ?)
    `;
    return await this.executeQuery(query, [token, new Date(decoded.exp * 1000)]);
  }

  updateUser() {

  }


}

module.exports = new UserModel();