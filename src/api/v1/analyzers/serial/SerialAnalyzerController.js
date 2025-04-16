const asyncHandler = require('express-async-handler');
const SerialAnalyzerModel = require("./SerialAnalyzerModel.js");
const pollingScheduler = require("../../../../features/data-collection/PollingScheduler.js");

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
    pollingScheduler.start()
    return res.status(200).send(`Inserted ${req.body.name} Modbus Serial`);
  })
    

  updateAnalyzer = asyncHandler(async(req, res) => {
    await SerialAnalyzerModel.updateAnalyzer(req.body, "Serial", req.user);
    pollingScheduler.start()
    return res.status(200).send(`Update Success`);
  })
  

  deleteAnalyzer = asyncHandler( async(req, res) => {
    await SerialAnalyzerModel.deleteAnalyzer(req.query.id, "Serial", req.user);
    pollingScheduler.start()
    return res.status(200).send(`Deleted ${req.body.name} Serial Analyzer`);
  })

  getSerialPorts = asyncHandler(async(req, res) => {
    const ports = await SerialAnalyzerModel.getAvailablePorts();
    return res.status(200).json(ports)
  })

}

module.exports = new SerialAnalyzerController();