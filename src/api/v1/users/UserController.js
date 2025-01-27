const UserModel = require("./UserModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

class UserController {

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

  
}

module.exports = new UserController;