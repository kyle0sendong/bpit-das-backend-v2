const { Router } = require("express");
const routesV1 = require("./api/v1/routes.js");

const router = Router();

router.use('/v1', routesV1);

module.exports = router;