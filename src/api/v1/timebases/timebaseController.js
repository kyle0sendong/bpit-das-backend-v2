const asyncHandler = require('express-async-handler')
const timebaseModel = require('./timebaseModel')

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
app.use(bodyParser.json())

const getAllTimebase = asyncHandler(async(req, res) => {
    const timebases = await timebaseModel.getAllTimebase()
    res.status(200).json(timebases)
})

const insertTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.insertTimebase(req.body)
    res.status(200).send(`Inserted ${req.body.timebase} minutes`)
})

const updateTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.updateTimebase(req.body)
    res.status(201).send('Updated timebase data')
})

const deleteTimebase = asyncHandler(async(req, res) => {
    await timebaseModel.deleteTimebase(req.body)
    res.status(200).send(`Deleted timebase with id:${req.body.id}`)
})

module.exports = {getAllTimebase, insertTimebase, updateTimebase, deleteTimebase}