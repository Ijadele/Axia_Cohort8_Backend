const express = require('express');
const authentication = require("../middlewares/auth.middleware")
const {createKyc, getOneKyc} = require('../controllers/kyc.controller')

const route = express.Router();

route.post("/kyc", authentication, createKyc);
route.get("/kyc", getOneKyc);

module.exports= route;