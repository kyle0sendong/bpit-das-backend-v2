const asyncHandler = require('express-async-handler')
const timebaseModel = require('./TimebaseModel.js')

class TimebaseController {

  getAllTimebase = asyncHandler(async(req, res) => {
    const timebases = await timebaseModel.getAllTimebases();
    return res.status(200).json(timebases);
  })

  insertTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.insert(req.body);
    return res.status(200).send(`Inserted ${req.body.timebase} minutes`);
  })

  updateTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.updateTimebase(req.body);
    return res.status(201).send('Updated timebase data');
  })

  deleteTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.delete(req.query.id);
    return res.status(200).send(`Deleted timebase with id:${req.query.id}`);
  })
}


module.exports = new TimebaseController();