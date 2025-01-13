const asyncHandler = require('express-async-handler');
const UserLogModel = require('./UserLogModel');
const { getDateTodayToTomorrow } = require("@utils/date");

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
    const [from, to] = getDateTodayToTomorrow();
    const dateFrom = req.query.from == undefined ? from : req.query.from;
    const dateTo = req.query.to == undefined ?  from : req.query.to;
    const logsByDate = await UserLogModel.getLogByDate([dateFrom, dateTo]);
    return res.status(200).json(logsByDate);
  })

  insertLog = asyncHandler(async(req,res) => {
    await UserLogModel.insert(req.body);
    return res.status(200).send(`Inserted Log Data`);
  })
}

module.exports = new UserLogController();
