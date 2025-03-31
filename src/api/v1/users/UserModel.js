const ApiBaseModel = require("@api/ApiBaseModel.js");
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
    try {
      // Validate input data
      if (!newData || !newData.id) {
        throw new Error('User ID is required');
      }
  
      // Check if password change is attempted
      const isPasswordChange = newData.current_password && newData.new_password;
  
      // If password change is attempted, validate current password
      if (isPasswordChange) {
        // Fetch existing user to verify current password
        const existingUser = await this.getUserById(newData.id);
        
        // Compare current password (assuming you're using bcrypt)
        const isPasswordValid = await bcrypt.compare(
          newData.current_password, 
          existingUser.password
        );
  
        if (!isPasswordValid) {
          return { 
            code: 401, 
            json: { message: "Current password is incorrect" } 
          };
        }
  
        // Hash new password
        const hashedPassword = await bcrypt.hash(newData.new_password, 10);
        newData.password = hashedPassword;
  
        // Remove password-related fields not needed for database update
        delete newData.current_password;
        delete newData.new_password;
      }
  
      // Prepare update data (exclude sensitive fields)
      const updateFields = ['first_name', 'last_name', 'email', 'password'];
      const filteredData = {};
  
      // Only include specified fields that are present
      updateFields.forEach(field => {
        if (newData[field] !== undefined) {
          filteredData[field] = newData[field];
        }
      });
  
      // Perform the update
      await this.update({
        id: newData.id,
        ...filteredData
      });
  
      // Fetch updated user data
      const updateData = await this.getUserById(newData.id);
  
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
  
      return { 
        code: 200, 
        json: {
          message: isPasswordChange 
            ? "Account updated successfully. Password changed." 
            : "Account updated successfully",
          token,
          user
        }
      };
  
    } catch (error) {
      console.error('Update user error:', error);
  
      // Handle specific error types
      if (error.name === 'ValidationError') {
        return { 
          code: 400, 
          json: { message: error.message } 
        };
      }
  
      return { 
        code: 500,
        json: { 
          message: "An error occurred while updating the account",
          error: error.message 
        } 
      };
    }
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
      role_id: data.roleId
    };

    // Insert user into the database
    try {
      await this.insert(user);
      return { code: 201, json: {message: "User registered successfully"}};
    } catch (error) {
      console.log(error)
    }
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