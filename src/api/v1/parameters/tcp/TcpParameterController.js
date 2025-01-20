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
    const tcpName = req.body.name ?? undefined;
    const allParameters = [];
    for(let i = 0; i < numberOfParameter; i++) {
      const randomNumber = createRandomNumber();
      const parameterData = {
        name: `${tcpName}_${randomNumber}`,
        unit: "asd",
        enable: 1,
        request_interval: 5,
        format: "testing",
        function_code: "testing",
        start_register_address: 1,
        register_count: 1,
        formula: "x * 1",
        tcp_analyzer_id: tcpId
      }
      allParameters.push(parameterData);
    }
    await TcpParameterModel.insertParameter(allParameters)
    return res.status(200).send(`Inserted ${req.body.name} parameter`)
  })

  updateParameter = asyncHandler(async(req, res) => {
    await TcpParameterModel.updateParameter(req.body)
    return res.status(200).send(`Updated parameters`)
  })

  deleteParameter = asyncHandler(async(req, res) => {
    await TcpParameterModel.delete(req.query.id)
    return res.status(200).send(`Deleted '${req.query.name}' parameter`)
  })

}

module.exports = new TcpParameterController();
