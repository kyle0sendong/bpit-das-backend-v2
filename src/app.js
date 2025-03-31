const express = require("express");
const routes = require("@routes");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const CustomError = require("./middleware/CustomError.js");
const pollingScheduler  = require("./features/data-collection/PollingScheduler.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

pollingScheduler.start();

app.use(cors({
  origin: true
}));

app.use("/api", routes);

app.all('*', (req, res, next) => {
  const error = new CustomError('Error', res.status(404));
  error.status = 'Fail';
  error.statusCode = '404';
  next(error)
});

app.use(errorHandler);

module.exports = app;