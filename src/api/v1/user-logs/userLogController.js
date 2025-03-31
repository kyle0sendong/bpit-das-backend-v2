const asyncHandler = require('express-async-handler');
const UserLogModel = require('./UserLogModel.js');
const { getDateTodayToTomorrow } = require("@utils/date.js");

class UserLogController {

  getLatestLog = asyncHandler( async(req, res) => {
    const latestLog = await UserLogModel.getLatestLog();
    return res.status(200).json(latestLog);
  })

  getDistinctDate = asyncHandler( async(req, res) => {
    const dates = await UserLogModel.getDistinctDate();
    return res.status(200).json(dates);
  })

  getUserLogsByDate = asyncHandler( async(req, res) => {
    const [today, tomorrow] = getDateTodayToTomorrow();
    const from = req.query.from ?? today;
    const to = req.query.to ?? tomorrow;
    const logsByDate = await UserLogModel.getLogByDate(from, to);
    return res.status(200).json(logsByDate);
  })

  insertLog = asyncHandler(async(req,res) => {
    await UserLogModel.insert(req.body);
    return res.status(200).send(`Inserted Log Data`);
  })
}

module.exports = new UserLogController();
