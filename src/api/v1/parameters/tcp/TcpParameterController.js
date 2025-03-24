const asyncHandler = require('express-async-handler');
const TcpParameterModel = require("./TcpParameterModel");
const { createRandomNumber } = require("@utils/rng");

class TcpParameterController {


  getParameters = asyncHandler( async(req, res) => {

    const analyzerId = req.query.id ?? 0;
    if(analyzerId > 0) {  // if supplied analyzer
      const result = await TcpParameterModel.getParametersByAnalyzerId(analyzerId);
      return res.status(200).json(result);
    }

    const result = await TcpParameterModel.getAll();
    return res.status(200).json(result);
  })

  insertParameter = asyncHandler(async(req, res) => {

    const numberOfParameter = req.body.number ?? 1;
    const tcpId = req.body.id ?? 0;
    const allParameters = [];

    for(let i = 0; i < numberOfParameter; i++) {
      const randomNumber = createRandomNumber();
      const parameterData = {
        name: `Default${randomNumber}`,
        analyzer_id: tcpId
      }
      allParameters.push(parameterData);
    }

    await TcpParameterModel.insertParameter(allParameters, 'tcp', req.user, numberOfParameter, tcpId);
    return res.status(200).send(`Inserted ${req.body.name} parameter`)
  })

  updateParameter = asyncHandler(async(req, res) => {
    const parametersToUpdate = req.body;

    // Process each parameter in the array
    for (const paramUpdate of parametersToUpdate) {
      try {
        // Get the current parameter from the database
        const currentParameter = await TcpParameterModel.getById(paramUpdate.id);
        if (!currentParameter) continue;
        
        // Check if this parameter has actually changed
        if (TcpParameterModel.hasParameterChanged(currentParameter[0], paramUpdate)) {
            await TcpParameterModel.updateParameter(paramUpdate, 'tcp', req.user);
        } else {
            // No changes for this parameter
            console.log("no changes on ", paramUpdate.name)
        }
      } catch(error) {
        console.log(error)
      }
    }

    return res.status(200).send(`Updated parameters`)
  })

  deleteParameter = asyncHandler(async(req, res) => {
    await TcpParameterModel.deleteParameter(req.query.id, 'tcp', req.user)
    return res.status(200).send(`Deleted parameter '${req.query.name}' from `)
  })

}

module.exports = new TcpParameterController();
