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

  registerUser = asyncHandler( async(req, res) => {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      email: req.body.email,
      password: password,
      first_name: req.body.firstName,
      last_name: req.body.lastName
    }
    await UserModel.insert(user);
    res.sendStatus(200);
  })

  loginUser = asyncHandler( async(req, res) => {
    const user = await UserModel.getUserByUsername(req.body.username);

    // if wrong password or wrong username
    if(!user) {
      console.log("sad");
      return res.sendStatus(401);
    } 

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordValid) {
      return res.sendStatus(401); 
    }

    const jwtToken = jwt.sign({userId: user.id}, process.env.JWT_SECRET, { expiresIn: '30d'});
    
    return res.status(200).json({
      message: "Login successful",
      jwtToken,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  })

  logoutUser = asyncHandler( async(req, res) => {

  })
}

module.exports = new UserController;