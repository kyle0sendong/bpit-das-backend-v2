const { Router } = require("express");
const TcpAnalyzerController = require("./analyzers/tcp/TcpAnalyzerController");
const ParameterController = require("./parameters/ParameterController");

const router = Router();

router.get('/tcp-analyzers', TcpAnalyzerController.getTcpAnalyzer);
router.post('/tcp-analyzers', TcpAnalyzerController.insertTcpAnalyzer);
router.patch('/tcp-analyzers', TcpAnalyzerController.updateTcpAnalyzer);
router.delete('/tcp-analyzers', TcpAnalyzerController.deleteTcpAnalyzer);

router.get('/parameters', ParameterController.getParameters);
router.post('/parameters', ParameterController.insertParameter);
router.patch('/parameters', ParameterController.updateParameter);
router.delete('/parameters', ParameterController.deleteParameter);

module.exports = router;