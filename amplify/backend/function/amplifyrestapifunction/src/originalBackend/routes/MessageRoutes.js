//import { Router } from "express";
// import MessageController from "../controllers/MessageController";
const express = require("express");
var router = express.Router();
const MessageController = require("../controllers/MessageController");
//const router = Router();

router.get("/all", MessageController.getAllMessages);

//export default router;
module.exports = router;
