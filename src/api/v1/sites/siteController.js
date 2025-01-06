const asyncHandler = require('express-async-handler');
const express = require('express');
const siteModel = require('./siteModel');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const getSite = asyncHandler(async(req, res) => {
    const site = await siteModel.getSite()
    res.status(200).json(site)
})

const getAllSiteName = asyncHandler( async(req,res) => {
    const sites = await siteModel.getAllSiteName()
    res.status(200).json(sites)
})
const updateSite = asyncHandler(async(req, res) => {
    await siteModel.updateSite(req.body)
    res.status(201).send(`Updated ${req.body.name}`)
})

module.exports = {getSite, updateSite, getAllSiteName}