const asyncHandler = require('express-async-handler');
const StationModel = require('./StationModel.js');

class StationController {
  
  getAllSites = asyncHandler(async(req, res) => {
    const result = await StationModel.getAll();
    return res.status(200).json(result);
  })
  
  updateSite = asyncHandler(async(req, res) => {
    await StationModel.update(req.body);
    res.status(201).send(`Updated ${req.body.name}`);
  })
}


module.exports = new StationController();