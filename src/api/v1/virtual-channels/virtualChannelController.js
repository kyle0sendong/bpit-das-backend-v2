const asyncHandler = require('express-async-handler');
const VirtualChannelModel = require('./VirtualChannelModel');

class VirtualChannelController {

  getVirtualChannel = asyncHandler( async(req, res) => {
    const id = req.params.id ?? 0;
    if(id > 0) {
      const data = await VirtualChannelModel.getById(req.params.id);
      return res.status(200).json(data);
    } else {
      const data = await VirtualChannelModel.getAll();
      return res.status(200).json(data);
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
    await VirtualChannelModel.delete(req.body.id);
    return res.status(200).send(`Deleted Virtual Channel`);
  })
}


module.exports = new VirtualChannelController();
