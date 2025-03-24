const asyncHandler = require('express-async-handler');
const SerialParameterModel = require("./SerialParameterModel");
const { createRandomNumber } = require("@utils/rng");

class SerialParameterController {

  getParameters = asyncHandler( async(req, res) => {

    const analyzerId = req.query.id ?? 0;
    if(analyzerId > 0) {  // if supplied analyzer
      const result = await SerialParameterModel.getParametersByAnalyzerId(analyzerId);
      return res.status(200).json(result);
    }

    const result = await SerialParameterModel.getAll();
    return res.status(200).json(result);
  })

  insertParameter = asyncHandler(async(req, res) => {

    const numberOfParameter = req.body.number ?? 1;
    const serialId = req.body.id ?? 0;
    const allParameters = [];

    for(let i = 0; i < numberOfParameter; i++) {
      const randomNumber = createRandomNumber();
      const parameterData = {
        name: `Default${randomNumber}`,
        analyzer_id: serialId
      }
      allParameters.push(parameterData);
    }

    await SerialParameterModel.insertParameter(allParameters, 'serial', req.user, numberOfParameter, serialId);
    return res.status(200).send(`Inserted ${req.body.name} parameter`)
  })

  updateParameter = asyncHandler(async(req, res) => {
    const parametersToUpdate = req.body;

    // Process each parameter in the array
    for (const paramUpdate of parametersToUpdate) {
      try {
        // Get the current parameter from the database
        const currentParameter = await SerialParameterModel.getById(paramUpdate.id);
        if (!currentParameter) continue;
        
        if (SerialParameterModel.hasParameterChanged(currentParameter[0], paramUpdate)) {
            await SerialParameterModel.updateParameter(paramUpdate, 'serial', req.user);
        } else {
            console.log("No changes on ", paramUpdate.name)
        }
      } catch(error) {
        console.log(error)
      }
    }

    return res.status(200).send(`Updated parameters`)
  })

  deleteParameter = asyncHandler(async(req, res) => {
    await SerialParameterModel.deleteParameter(req.query.id, 'serial', req.user)
    return res.status(200).send(`Deleted parameter '${req.query.name}' from `)
  })

}

module.exports = new SerialParameterController();
