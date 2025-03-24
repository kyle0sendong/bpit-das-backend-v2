const asyncHandler = require('express-async-handler');
const VirtualChannelModel = require('./VirtualChannelModel');
const { createRandomNumber } = require("@utils/rng");

class VirtualChannelController {

  getVirtualChannel = asyncHandler( async(req, res) => {
    const result = await VirtualChannelModel.getAll();
    return res.status(200).json(result);
  })
  
  insertVirtualChannel = asyncHandler( async(req, res) => {

    const numberOfParameter = req.body.number ?? 1;

    const allParameters = [];
    for(let i = 0; i < numberOfParameter; i++) {
      const randomNumber = createRandomNumber();
      const parameterData = {
        name: `Default${randomNumber}`,
        unit: " ",
        formula: "x * y"
      }
      allParameters.push(parameterData);
    }

    await VirtualChannelModel.insertParameter(allParameters, "vc", req.user, numberOfParameter);
    return res.status(200).send(`Inserted Virtual Channel`);
  })
  
  updateVirtualChannel = asyncHandler(async(req, res) => {
    const parametersToUpdate = req.body;

    // Process each parameter in the array
    for (const paramUpdate of parametersToUpdate) {
      try {
        // Get the current parameter from the database
        const currentParameter = await VirtualChannelModel.getById(paramUpdate.id);
        if (!currentParameter) continue;
        
        // Check if this parameter has actually changed
        if (VirtualChannelModel.hasParameterChanged(currentParameter[0], paramUpdate)) {
            await VirtualChannelModel.updateParameter(paramUpdate, 'vc', req.user);
        } else {
            // No changes for this parameter
            console.log("no changes on ", paramUpdate.name)
        }
      } catch(error) {
        console.log(error)
      }
    }

    return res.status(200).send(`Updated Virtual Channel`)
  })
  
  deleteVirtualChannel = asyncHandler( async(req, res) => {
    await VirtualChannelModel.deleteVirtualChannel(req.query.id, req.user);
    return res.status(200).send(`Deleted Virtual Channel`);
  })
}


module.exports = new VirtualChannelController();
