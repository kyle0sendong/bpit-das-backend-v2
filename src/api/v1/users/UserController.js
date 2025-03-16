const UserModel = require("./UserModel");
const asyncHandler = require("express-async-handler");

class UserController {

  getUserRoles = asyncHandler(async (req, res) => {
    const data = await UserModel.getUserRoles();
    return res.status(200).json(data);
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

  getAllUsers = asyncHandler( async(req, res) => {
    const data = await UserModel.getAllUsers();
    return res.status(200).json(data);
  })
  
  updateUser = asyncHandler( async(req, res) => {
    const result = await UserModel.updateUser(req.body);
    return res.status(result.code).json(result.json);
  })

  updateOtherUser = asyncHandler( async(req, res) => {
    try {
      await UserModel.update(req.body);
      return res.status(200).send("Updated user successfully");
    } catch(error) {
      console.log(error);
    }
  })

  deleteUser = asyncHandler( async(req, res) => {
    await UserModel.delete(req.body.id);
    return res.status(200).send(`Deleted user`);
  })
}

module.exports = new UserController;