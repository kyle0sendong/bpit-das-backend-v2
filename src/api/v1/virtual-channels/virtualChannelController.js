const asyncHandler = require('express-async-handler');
const VirtualChannelModel = require('./VirtualChannelModel');

class VirtualChannelController {

  getVirtualChannel = asyncHandler( async(req, res) => {
    const analyzerId = req.query.id ?? 0;
    if(analyzerId > 0) {
      const result = await VirtualChannelModel.getVirtualChannelsByAnalyzerId(analyzerId);
      return res.status(200).json(result);
    } else {
      const result = await VirtualChannelModel.getAll();
      return res.status(200).json(result);
    }
  })
  
  insertVirtualChannel = asyncHandler( async(req, res) => {
    await VirtualChannelModel.insert(req.body);
    return res.status(200).send(`Inserted Virtual Channel ${req.body.name}`);
  })
  
  updateVirtualChannel = asyncHandler( async(req, res) => {
    await VirtualChannelModel.update(req.body);
    return res.status(200).send(`Update Virtual Channel ${req.body.parameter_name}`);
  })
  
  deleteVirtualChannel = asyncHandler( async(req, res) => {
    await VirtualChannelModel.delete(req.query.id);
    return res.status(200).send(`Deleted Virtual Channel`);
  })
}


module.exports = new VirtualChannelController();
