const asyncHandler = require('express-async-handler')
const parameterModel = require('./parameterModel')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

const insertParameter = asyncHandler(async(req, res) => {
    await parameterModel.insertParameter(req.body)
    res.status(200).send(`Inserted ${req.body.name} parameter`)
})

const getParameter = asyncHandler( async(req, res) => {
    const parameter = await parameterModel.getParameter(req.params.id)
    res.status(200).json(parameter)
})

const getAllParameter = asyncHandler(async(req, res) => {
    const parameters = await parameterModel.getAllParameter()
    res.status(200).json(parameters)
})

const updateParameter = asyncHandler(async(req, res) => {
    await parameterModel.updateParameter(req.body)
    res.status(200).send(`Updated ${req.body.name} parameter`)
})

const deleteParameter = asyncHandler(async(req, res) => {
    await parameterModel.deleteParameter(req.body.id)
    res.status(200).send(`Deleted '${req.body.name}' parameter`)
})

module.exports = {insertParameter, getParameter, getAllParameter, updateParameter, deleteParameter}
