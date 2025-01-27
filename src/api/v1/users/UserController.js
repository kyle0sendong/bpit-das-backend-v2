const UserModel = require("./UserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {

  checkToken = asyncHandler( async(req,res) => {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(req.body.token, secretKey);
    res.send(200).json(decoded);
  })

  registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
  
    // Check if user already exists
    const existingUser = await UserModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create user object
    const user = {
      username,
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    };
  
    // Insert user into the database
    await UserModel.insert(user);
  
    res.status(201).json({ message: "User registered successfully" });
  });

  loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
  
    // Check if user exists
    const user = await UserModel.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  
    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  
    // Return response
    return res.status(200).json({
      message: "Login successful",
      jwtToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  });

  logoutUser = asyncHandler( async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    try {
        await UserModel.logOut(token);
        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Invalid token.' });
    }
  })
}

module.exports = new UserController;