const { Router } = require("express");
const TcpAnalyzerController = require("./analyzers/tcp/TcpAnalyzerController");

const router = Router();

router.get('/tcp-analyzer', TcpAnalyzerController.getTcpAnalyzer);
router.post('/tcp-analyzer', TcpAnalyzerController.insertTcpAnalyzer);
router.patch('/tcp-analyzer', TcpAnalyzerController.updateTcpAnalyzer);
router.delete('/tcp-analyzer', TcpAnalyzerController.deleteTcpAnalyzer);

module.exports = router;