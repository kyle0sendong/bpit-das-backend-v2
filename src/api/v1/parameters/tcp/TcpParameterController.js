const asyncHandler = require('express-async-handler');
const TcpParameterModel = require("./TcpParameterModel");
const { createRandomNumber } = require("@utils/rng");

class TcpParameterController {

  getParameters = asyncHandler( async(req, res) => {
    const analyzerId = req.query.id ?? 0;
    if(analyzerId > 0) {
      const result = await TcpParameterModel.getParametersByAnalyzerId(analyzerId);
      return res.status(200).json(result);
    } else {
      const result = await TcpParameterModel.getAll();
      return res.status(200).json(result);
    }
  })

  insertParameter = asyncHandler(async(req, res) => {

    const numberOfParameter = req.body.number ?? 1;
    const tcpId = req.body.id ?? 0;
    const name = req.body.name ?? "Default";
    const allParameters = [];

    for(let i = 0; i < numberOfParameter; i++) {
      const randomNumber = createRandomNumber();
      const parameterData = {
        name: `${name}_${randomNumber}`,
        unit: "N/A",
        enable: 1,
        request_interval: 5,
        format: "N/A",
        function_code: "N/A",
        start_register_address: 1,
        register_count: 1,
        formula: "x * 1",
        analyzer_id: tcpId
      }
      allParameters.push(parameterData);
    }

    await TcpParameterModel.insertParameter(allParameters, 'tcp', req.user, numberOfParameter, tcpId);
    return res.status(200).send(`Inserted ${req.body.name} parameter`)
  })

  updateParameter = asyncHandler(async(req, res) => {
    await TcpParameterModel.updateParameter(req.body, 'tcp')
    return res.status(200).send(`Updated parameters`)
  })

  deleteParameter = asyncHandler(async(req, res) => {
    await TcpParameterModel.deleteParameter(req.query.id, 'tcp', req.user)
    return res.status(200).send(`Deleted parameter '${req.query.name}' from `)
  })

}

module.exports = new TcpParameterController();
