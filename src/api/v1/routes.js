const { Router } = require("express");
const router = Router();

const TcpAnalyzerController = require("./analyzers/tcp/TcpAnalyzerController");
const TcpParameterController = require("./parameters/tcp/TcpParameterController");
const StationController = require("./stations/StationController");
const TimebaseController = require("./timebases/TimebaseController");
const UserLogController = require("./user-logs/UserLogController");
const VirtualChannelController = require("./parameters/virtual-channels/VirtualChannelController");
const CurrentValueController = require("./current-values/CurrentValueController");
const AnalyzerDataController = require("./analyzer-data/AnalyzerDataController");
const UserController = require("./users/UserController");

const validateToken = require("@middleware/validateToken");
const checkPrivilege = require("@middleware/checkPrivilege");

// unprotected routes
router.get('/tcp-analyzers', TcpAnalyzerController.getTcpAnalyzer);
router.get('/current-values', CurrentValueController.getCurrentValues);

router.get('/virtual-channels', VirtualChannelController.getVirtualChannel);
router.get('/tcp-parameters', TcpParameterController.getParameters);
router.get('/analyzer-data', AnalyzerDataController.getAnalyzerData);

router.post('/login', UserController.loginUser);

// protected routes
router.get('/sites', StationController.getAllSites);

router.use(validateToken, checkPrivilege(["admin", "integrator"]));
router.post('/tcp-analyzers', TcpAnalyzerController.insertTcpAnalyzer);
router.patch('/tcp-analyzers', TcpAnalyzerController.updateTcpAnalyzer);
router.delete('/tcp-analyzers', TcpAnalyzerController.deleteTcpAnalyzer);

router.post('/current-values', CurrentValueController.insertCurrentValue);
router.patch('/current-values', CurrentValueController.updateCurrentValue);

router.post('/tcp-parameters', TcpParameterController.insertParameter);
router.patch('/tcp-parameters', TcpParameterController.updateParameter);
router.delete('/tcp-parameters', TcpParameterController.deleteParameter);

router.patch('/sites', StationController.updateSite);

router.get('/timebases', TimebaseController.getAllTimebase);
router.post('/timebases', TimebaseController.insertTimebase);
router.patch('/timebases', TimebaseController.updateTimebase);
router.delete('/timebases', TimebaseController.deleteTimebase);

router.get('/user-logs', UserLogController.getUserLogsByDate);
router.get('/log-distinct-dates', UserLogController.getDistinctDate);

router.post('/virtual-channels', VirtualChannelController.insertVirtualChannel);
router.patch('/virtual-channels', VirtualChannelController.updateVirtualChannel);
router.delete('/virtual-channels', VirtualChannelController.deleteVirtualChannel);

router.post('/logout', UserController.logoutUser);

// admin only routes
router.use(validateToken, checkPrivilege(["admin"]));
router.get('/users', UserController.getAllUsers);
router.post('/register', UserController.registerUser);
router.patch('/user', UserController.updateUser);
router.delete('/user', UserController.deleteUser);
router.get('/user-roles', UserController.getUserRoles);

module.exports = router;