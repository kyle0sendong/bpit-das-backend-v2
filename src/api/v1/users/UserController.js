const UserModel = require("./UserModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

class UserController {

  checkToken = asyncHandler( async(req,res) => {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(req.body.token, secretKey);
    res.send(200).json(decoded);
  })

  registerUser = asyncHandler(async (req, res) => {
    const result = await UserModel.register(req.body);
    return res.status(result.code).json(result.json);
  });

  loginUser = asyncHandler(async (req, res) => {
    const result = await UserModel.login(req.body);
    return res.status(result.code).json(result.json);
  });

  logoutUser = asyncHandler( async(req, res) => {
    const token = req.headers.authorization;

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