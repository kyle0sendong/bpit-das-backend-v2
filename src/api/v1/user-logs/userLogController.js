const asyncHandler = require('express-async-handler')
const userLogsModel = require('./userLogModel')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json());

const insertLog = asyncHandler(async(req,res) => {
  await userLogsModel.insertLog(req.body)
  res.status(200).send(`Inserted Data`)
})

const getLatestLog = asyncHandler(async(req,res) => {
  const logData = await userLogsModel.getLatestLog()
  res.status(200).json(logData)
})

const getLog = asyncHandler(async(req,res) => {
  const logData = await userLogsModel.getLog(req.query)
  res.status(200).json(logData)
})

const getLogDateRange = asyncHandler(async(req,res) => {
  const logData = await userLogsModel.getLogDateRange(req.query)
  res.status(200).json(logData)
})

const getDistinctDateLogs = asyncHandler(async(req, res) => {
  const dates = await userLogsModel.getDistinctDateLogs()
  res.status(200).json(dates)
})


module.exports = {insertLog, getLog, getLatestLog, getLogDateRange, getDistinctDateLogs}
