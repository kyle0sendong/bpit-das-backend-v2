const asyncHandler = require('express-async-handler');
const TcpAnalyzerModel = require("./TcpAnalyzerModel");
const pollingScheduler = require("../../../../features/data-collection/PollingScheduler");

class TcpAnalyzerController {
  
  
  getAnalyzer = asyncHandler( async(req, res) => {
    const id = req.query.id ?? 0;
    if(id > 0) {
      const result = await TcpAnalyzerModel.getById(req.query.id);
      return res.status(200).json(result);
    } else {
      const result = await TcpAnalyzerModel.getAll();
      return res.status(200).json(result);
    }
  })


  insertAnalyzer = asyncHandler(async(req, res) => {
    await TcpAnalyzerModel.insertAnalyzer(req.body, "TCP", req.user);
    pollingScheduler.start()
    return res.status(200).send(`Inserted ${req.body.name} Modbus TCP`);
  })
    

  updateAnalyzer = asyncHandler(async(req, res) => {
    await TcpAnalyzerModel.updateAnalyzer(req.body, "TCP", req.user);
    pollingScheduler.start()
    return res.status(200).send(`Update Success`);
  })
  

  deleteAnalyzer = asyncHandler( async(req, res) => {
    await TcpAnalyzerModel.deleteAnalyzer(req.query.id, "TCP", req.user);
    pollingScheduler.start()
    return res.status(200).send(`Deleted ${req.body.name} TCP Analyzer`);
  })

}

module.exports = new TcpAnalyzerController();