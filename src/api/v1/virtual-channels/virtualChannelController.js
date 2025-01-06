const asyncHandler = require('express-async-handler');
const derivedParameterModel = require('./virtualChannelModel');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const insertDerivedParameter = asyncHandler( async(req, res) => {
  await derivedParameterModel.insertDerivedParameter(req.body)
  res.status(200).send(`Inserted Virtual Channel ${req.body.name}`)
})

const getDerivedParameter = asyncHandler( async(req, res) => {
  const data = await derivedParameterModel.getDerivedParameter(req.params.id)
  res.status(200).json(data)
})

const getAllDerivedParameter = asyncHandler( async(req, res) => {
  const data = await derivedParameterModel.getAllDerivedParameter()
  res.status(200).json(data)
})

const updateDerivedParameter = asyncHandler( async(req, res) => {
  await derivedParameterModel.updateDerivedParameter(req.body)
  res.status(200).send(`Update Virtual Channel ${req.body.parameter_name}`)
})

const deleteDerivedParameter = asyncHandler( async(req, res) => {
  await derivedParameterModel.deleteDerivedParameter(req.body.id)
  res.status(200).send(`Deleted Virtual Channel`)
})

module.exports = {insertDerivedParameter, updateDerivedParameter, getDerivedParameter, getAllDerivedParameter, deleteDerivedParameter}

