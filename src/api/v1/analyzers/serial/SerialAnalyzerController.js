const asyncHandler = require('express-async-handler');
const SerialAnalyzerModel = require("./SerialAnalyzerModel");

class SerialAnalyzerController {
  
  getAnalyzer = asyncHandler( async(req, res) => {
    const id = req.query.id ?? 0;
    if(id > 0) {
      const result = await SerialAnalyzerModel.getById(req.query.id);
      return res.status(200).json(result);
    } else {
      const result = await SerialAnalyzerModel.getAll();
      return res.status(200).json(result);
    }
  })

  insertAnalyzer = asyncHandler(async(req, res) => {
    await SerialAnalyzerModel.insertAnalyzer(req.body, "Serial", req.user);
    return res.status(200).send(`Inserted ${req.body.name} Modbus Serial`);
  })
    

  updateAnalyzer = asyncHandler(async(req, res) => {
    await SerialAnalyzerModel.updateAnalyzer(req.body, "Serial", req.user);
    return res.status(200).send(`Update Success`);
  })
  

  deleteAnalyzer = asyncHandler( async(req, res) => {
    await SerialAnalyzerModel.deleteAnalyzer(req.query.id, "Serial", req.user);
    return res.status(200).send(`Deleted ${req.body.name} Serial Analyzer`);
  })

}

module.exports = new SerialAnalyzerController();