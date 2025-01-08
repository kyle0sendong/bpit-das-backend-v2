const asyncHandler = require('express-async-handler');
const ParameterModel = require("./ParameterModel");

class ParameterController {

  getParameters = asyncHandler( async(req, res) => {
    const analyzerId = req.query.analyzer_id ?? 0;
    if(analyzerId > 0) {
      const result = await ParameterModel.getParametersByAnalyzerId(analyzerId);
      return res.status(200).json(result);
    } else {
      const result = await ParameterModel.getAll();
      return res.status(200).json(result);
    }
  })

  insertParameter = asyncHandler(async(req, res) => {
    await ParameterModel.insert(req.body)
    return res.status(200).send(`Inserted ${req.body.name} parameter`)
  })

  updateParameter = asyncHandler(async(req, res) => {
    await ParameterModel.update(req.body)
    return res.status(200).send(`Updated ${req.body.name} parameter`)
  })

  deleteParameter = asyncHandler(async(req, res) => {
    await ParameterModel.delete(req.query.id)
    return res.status(200).send(`Deleted '${req.query.name}' parameter`)
  })

}

module.exports = new ParameterController();
