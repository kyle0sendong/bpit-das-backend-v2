const asyncHandler = require('express-async-handler')
const timebaseModel = require('./timebaseModel')

class TimebaseController {

  getAllTimebase = asyncHandler(async(req, res) => {
    const timebases = await timebaseModel.getAll();
    return res.status(200).json(timebases);
  })

  insertTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.insert(req.body);
    return res.status(200).send(`Inserted ${req.body.timebase} minutes`);
  })

  updateTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.update(req.body);
    return res.status(201).send('Updated timebase data');
  })

  deleteTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.delete(req.body);
    return res.status(200).send(`Deleted timebase with id:${req.body.id}`);
  })
}


module.exports = new TimebaseController();