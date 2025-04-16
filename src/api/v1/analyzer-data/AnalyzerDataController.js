const asyncHandler = require('express-async-handler');
const AnalyzerDataModel = require("./AnalyzerDataModel.js");
const { getDateTodayToTomorrow } = require("../../../utils/date.js");

class AnalyzerDataController {
  
  getAnalyzerData = asyncHandler( async(req, res) => {

    const [fromTemp, ] = getDateTodayToTomorrow();
    const from = req.query.from ?? fromTemp;
    const to = req.query.to ?? from;
    const timebase = req.query.timebase;
    const analyzer = req.query.analyzer;
    const analyzerType = req.query.analyzerType;
    const result = await AnalyzerDataModel.getAnalyzerData({from, to, analyzer, analyzerType, timebase});
    return res.status(200).json(result);
  })

  getVirtualChannelsData = asyncHandler( async(req, res) => {

    const [fromTemp, ] = getDateTodayToTomorrow();
    const from = req.query.from ?? fromTemp;
    const to = req.query.to ?? from;
    const timebase = req.query.timebase;
    const result = await AnalyzerDataModel.getVirtualChannelsData({from, to, timebase});
    return res.status(200).json(result);
  })

}

module.exports = new AnalyzerDataController();