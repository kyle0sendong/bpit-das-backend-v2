const asyncHandler = require('express-async-handler');
const VirtualChannelModel = require('./VirtualChannelModel');
const { createRandomNumber } = require("@utils/rng");

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

    const numberOfParameter = req.body.number ?? 1;

    const allParameters = [];
    for(let i = 0; i < numberOfParameter; i++) {
      const randomNumber = createRandomNumber();
      const parameterData = {
        name: `VC_${randomNumber}`,
        unit: " ",
        formula: "x * y"
      }
      allParameters.push(parameterData);
    }

    await VirtualChannelModel.insertParameter(allParameters);
    return res.status(200).send(`Inserted Virtual Channel`);
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
