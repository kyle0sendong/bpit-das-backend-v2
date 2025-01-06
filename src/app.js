const express = require("express");
const routes = require("@routes");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const CustomError = require("./middleware/CustomError");

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cors({
  origin: true
}));

app.use("/api", routes);

app.get('/health', (req, res) => {
  res.status(200).send("Node Health: Okay")
});

app.all('*', (req, res, next) => {
  const error = new CustomError('Error', res.status(404));
  error.status = 'Fail';
  error.statusCode = '404';
  next(error)
});

app.use(errorHandler);

module.exports = app;