const asyncHandler = require('express-async-handler');
const TcpAnalyzerModel = require("./TcpAnalyzerModel");

class TcpAnalyzerController {
  
  getTcpAnalyzer = asyncHandler( async(req, res) => {
    const id = req.query.id ?? 0;
    if(id > 0) {
      const result = await TcpAnalyzerModel.getById(req.query.id);
      return res.status(200).json(result);
    } else {
      const result = await TcpAnalyzerModel.getAll();
      return res.status(200).json(result);
    }
  })

  insertTcpAnalyzer = asyncHandler(async(req, res) => {
    await TcpAnalyzerModel.insertAnalyzer(req.body, "TCP", req.user);
    return res.status(200).send(`Inserted ${req.body.name} Modbus TCP`);
  })
    
  updateTcpAnalyzer = asyncHandler(async(req, res) => {
    await TcpAnalyzerModel.update(req.body)
    return res.status(200).send(`Update Success`)
  })
  
  deleteTcpAnalyzer = asyncHandler( async(req, res) => {
    await TcpAnalyzerModel.delete(req.query.id)
    return res.status(200).send(`Deleted ${req.body.name} TCP Analyzer`)
  })

}

module.exports = new TcpAnalyzerController();