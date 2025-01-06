const asyncHandler = require('express-async-handler');
const TcpAnalyzerModel = require("./TcpAnalyzerModel");

class TcpAnalyzerController {
  
  getTcpAnalyzer = asyncHandler( async(req, res) => {
    const id = req.query.id ?? 0;
    if(id > 0) {
      const result = await TcpAnalyzerModel.getById(req.query.id);
      res.status(200).json(result);
    } else {
      const result = await TcpAnalyzerModel.getAll();
      res.status(200).json(result);
    }
  })

  insertTcpAnalyzer = asyncHandler(async(req, res) => {
    await TcpAnalyzerModel.insert(req.body);
    res.status(200).send(`Inserted ${req.body.name} Modbus TCP`);
  })
    
  updateTcpAnalyzer = asyncHandler(async(req, res) => {
    await TcpAnalyzerModel.update(req.body)
    res.status(200).send(`Update Success`)
  })
  
  deleteTcpAnalyzer = asyncHandler( async(req, res) => {
    await TcpAnalyzerModel.delete(req.body.id)
    res.status(200).send(`Deleted ${req.body.name} TCP Analyzer`)
  })

}

module.exports = new TcpAnalyzerController();