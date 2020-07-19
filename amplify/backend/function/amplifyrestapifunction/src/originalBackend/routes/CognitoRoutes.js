//import { Router } from "express";
//import CognitoController from "../controllers/CognitoController";
const express = require("express");
var router = express.Router();
const CognitoController = require("../controllers/CognitoController");
//const CognitoService = require("../services/CognitoService");

//const router = Router();

router.post("/registerMember", CognitoController.Register);

//export default router;
module.exports = router;
