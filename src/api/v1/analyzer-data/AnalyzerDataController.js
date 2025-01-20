const asyncHandler = require('express-async-handler');
const AnalyzerDataModel = require("./AnalyzerDataModel");
const { getDateTodayToTomorrow } = require("@utils/date");

class AnalyzerDataController {
  
  getAnalyzerData = asyncHandler( async(req, res) => {

    const [fromTemp, toTemp] = getDateTodayToTomorrow();
    const from = req.query.from ?? fromTemp;
    const to = req.query.to ?? toTemp;
    const timebase = req.query.timebase;
    const analyzer = req.query.analyzer;

    const result = AnalyzerDataModel.getAnalyzerData({from, to, analyzer, timebase})
    return res.status(200).json(result);
  })

}

module.exports = new AnalyzerDataController();