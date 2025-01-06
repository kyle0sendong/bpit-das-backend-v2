const asyncHandler = require('express-async-handler');
const tcpAnalyzerModel = require('./tcpAnalyzerModel');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const asyncErrorHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(error => next(error))
    }
}

const insertTcpAnalyzer = asyncErrorHandler(async(req, res) => {
    await tcpAnalyzerModel.insertTcpAnalyzer(req.body)
    res.status(200).send(`Inserted ${req.body.name} Modbus TCP`)
})

const getTcpAnalyzer = asyncHandler( async(req, res) => {
    const tcpAnalyzer = await tcpAnalyzerModel.getTcpAnalyzer(req.params.id)
    res.status(200).json(tcpAnalyzer)
})

const getAllTcpAnalyzer = asyncErrorHandler(async(req, res) => {
    const tcpAnalyzers = await tcpAnalyzerModel.getAll()
    res.status(200).json(tcpAnalyzers)
})

const getTcpWithParameters = asyncErrorHandler(async(req,res) => {
    const tcpAnalyzerWithParameters = await tcpAnalyzerModel.getTcpWithParameters(req.body.id)
    res.status(200).json(tcpAnalyzerWithParameters)
})

const updateTcpAnalyzer = asyncHandler(async(req, res) => {
    await tcpAnalyzerModel.updateTcpAnalyzer(req.body)
    res.status(200).send(`Update Success`)
})

const deleteTcpAnalyzer = asyncHandler( async(req, res) => {
    await tcpAnalyzerModel.deleteTcpAnalyzer(req.body.id)
    res.status(200).send(`Deleted ${req.body.name} TCP Analyzer`)
})

module.exports = {insertTcpAnalyzer, getTcpAnalyzer, getAllTcpAnalyzer, updateTcpAnalyzer, deleteTcpAnalyzer, getTcpWithParameters}