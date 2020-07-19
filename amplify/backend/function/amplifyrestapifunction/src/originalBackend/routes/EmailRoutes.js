//import { Router } from "express";
//import EmailController from "../controllers/EmailController";
const express = require("express");
var router = express.Router();
const EmailController = require("../controllers/EmailController");

//const router = Router();

router.post("/mailtest1", EmailController.SendMail);

//export default router;
module.exports = router;
