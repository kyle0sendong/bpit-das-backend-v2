const asyncHandler = require('express-async-handler');
const UserLogModel = require('./UserLogModel');

class UserLogController {

  getUserLog = asyncHandler( async(req, res) => {
    const getType = req.query.getType ?? "latestLog";
    switch(getType) {
      case "latestLog":
        const latestLog = await UserLogModel.getLatestLog();
        return res.status(200).json(latestLog);
      case "logByDate":
        const logByDate = await UserLogModel.getLogByDate(req.query.date);
        return res.status(200).json(logByDate);
      case "logByDateRange":
        const logByDateRange = await UserLogModel.getLogByDateRange(req.query);
        return res.status(200).json(logByDateRange);
      case "distinctDate":
        const dates = await UserLogModel.getDistinctDate();
        return res.status(200).json(dates);
    }
  })

  insertLog = asyncHandler(async(req,res) => {
    await UserLogModel.insert(req.body);
    return res.status(200).send(`Inserted Log Data`);
  })
}

module.exports = new UserLogController();
