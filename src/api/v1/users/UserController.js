const asyncHandler = require("express-async-handler");
const UserModel = require("./UserModel.js");


class UserController {

  getUserRoles = asyncHandler(async (req, res) => {
    const data = await UserModel.getUserRoles();
    return res.status(200).json(data);
  })
  
  registerUser = asyncHandler(async (req, res) => {
    try {
      const result = await UserModel.register(req.body);
      return res.status(result.code).json(result.json);
    } catch(error) {
      console.log(error);
      return res.status(400).send("Insert user failed");
    }
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

  getAllUsers = asyncHandler( async(req, res) => {
    const data = await UserModel.getAllUsers();
    return res.status(200).json(data);
  })
  
  updateUser = asyncHandler( async(req, res) => {
    try {
      const result = await UserModel.updateUser(req.body);
      return res.status(result.code).json(result.json);
    } catch(error) {
      console.log(error);
      return res.status(400).send("Update user failed");
    }
  })

  updateOtherUser = asyncHandler( async(req, res) => {
    try {
      await UserModel.update(req.body);
      return res.status(200).send("Updated user successfully");
    } catch(error) {
      console.log(error);
      return res.status(400).send("Update user failed");
    }
  })

  deleteUser = asyncHandler( async(req, res) => {
    try {
      await UserModel.delete(req.body.id);
      return res.status(200).send(`Deleted user`);
    } catch(error) {
      console.log(error);
      return res.status(400).send("Delete user failed");
    }

  })
}

module.exports = new UserController;