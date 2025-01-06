const asyncHandler = require('express-async-handler')
const currentValuesModel = require("./currentValueModel")

const express = require("express")
const bodyParser = require("body-parser")
const app = express()
app.use(bodyParser.json())

const insertCurrentValue = asyncHandler( async(req, res) => {
  await currentValuesModel.insertCurrentValue(req.body)
  res.status(200).send(`Inserted current value for new parameter`)
})

const getCurrentValueTcp = asyncHandler( async(req, res) => {
  const currentValues = await currentValuesModel.getAllCurrentValuesTcp(req.params.id)
  res.status(200).json(currentValues)
})

const getAllCurrentValues = asyncHandler( async(req, res) => {
  const currentValues = await currentValuesModel.getAllCurrentValues()
  res.status(200).json(currentValues)
})

const updateCurrentValue = asyncHandler( async(req, res) => {
  await currentValuesModel.updateCurrentValue(req.body)
  res.status(200).send(`Inserted current value for new parameter`)
})

module.exports = {insertCurrentValue, getAllCurrentValues, getCurrentValueTcp, updateCurrentValue}
