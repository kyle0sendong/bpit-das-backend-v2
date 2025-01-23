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
    const analyzerType = req.query.analyzerType;
    const result = await AnalyzerDataModel.getAnalyzerData({from, to, analyzer, analyzerType, timebase});

    return res.status(200).json(result);
  })

}

module.exports = new AnalyzerDataController();