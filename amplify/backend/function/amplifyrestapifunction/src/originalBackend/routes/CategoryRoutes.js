const express = require("express");
var router = express.Router();
const categoryController = require("../controllers/CategoryController");

router.post("/insert", categoryController.insert);
router.get("/", categoryController.getAllCategories);

module.exports = router;
