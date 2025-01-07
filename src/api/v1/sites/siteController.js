const asyncHandler = require('express-async-handler');
const SiteModel = require('./SiteModel');

class SiteController {
  
  getAllSites = asyncHandler(async(req, res) => {
    const result = await SiteModel.getAll();
    return res.status(200).json(result);
  })
  
  updateSite = asyncHandler(async(req, res) => {
    await SiteModel.update(req.body);
    res.status(201).send(`Updated ${req.body.name}`);
  })
}


module.exports = new SiteController();