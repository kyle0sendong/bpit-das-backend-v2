const { Router } = require("express");
const router = Router();

const TcpAnalyzerController = require("./analyzers/tcp/TcpAnalyzerController");
const ParameterController = require("./parameters/ParameterController");
const SiteController = require("./sites/SiteController");
const TimebaseController = require("./timebases/TimebaseController");
const UserLogController = require("./user-logs/UserLogController");
const VirtualChannelController = require("./virtual-channels/VirtualChannelController");

router.get('/tcp-analyzers', TcpAnalyzerController.getTcpAnalyzer);
router.post('/tcp-analyzers', TcpAnalyzerController.insertTcpAnalyzer);
router.patch('/tcp-analyzers', TcpAnalyzerController.updateTcpAnalyzer);
router.delete('/tcp-analyzers', TcpAnalyzerController.deleteTcpAnalyzer);

router.get('/parameters', ParameterController.getParameters);
router.post('/parameters', ParameterController.insertParameter);
router.patch('/parameters', ParameterController.updateParameter);
router.delete('/parameters', ParameterController.deleteParameter);

router.get('/sites', SiteController.getAllSites);
router.patch('/sites', SiteController.updateSite);

router.get('/timebases', TimebaseController.getAllTimebase);
router.post('/timebases', TimebaseController.insertTimebase);
router.patch('/timebases', TimebaseController.updateTimebase);
router.delete('/timebases', TimebaseController.deleteTimebase);

router.get('/user-logs', UserLogController.getUserLog);
router.post('/user-logs', UserLogController.insertLog);

router.get('/virtual-channels', VirtualChannelController.getVirtualChannel);
router.post('/virtual-channels', VirtualChannelController.insertVirtualChannel);
router.patch('/virtual-channels', VirtualChannelController.updateVirtualChannel);
router.delete('/virtual-channels', VirtualChannelController.deleteVirtualChannel);

module.exports = router;