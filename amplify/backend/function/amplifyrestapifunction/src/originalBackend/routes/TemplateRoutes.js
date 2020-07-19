//import { Router } from "express";
const express = require("express");
var router = express.Router();
const TemplateController = require("../controllers/TemplateController");
//import TemplateController from "../controllers/TemplateController";
//const router = Router();

// this will pull all templates
router.get("/templates", TemplateController.getAllTemplates);

// This will pull a single template by id
router.get("/templates/:id", TemplateController.getTemplateById);

// This will update a single template by id
router.put("/templates/:id", TemplateController.updateTemplateById);

// This will add a new template
router.post("/templates", TemplateController.addNewTemplate);

// This will delete a template
router.delete("/delete/:id", TemplateController.deleteOne);

// This will update SOAP template
router.post("/templates/soap", TemplateController.addSoapTemplate);

// This will get SOAP template data
router.get("/templates_soap/getSoap", TemplateController.getSoapTemplate);

// This will update SOAP template
router.post("/templates/rating", TemplateController.addRatingTemplate);

// This will get SOAP template data
router.get("/templates_rating/getRating", TemplateController.getRatingTemplate);

// This will update SOAP template
router.post(
  "/templates_percentage/percentage",
  TemplateController.addPercentageTemplate
);

// This will get SOAP template data
router.get(
  "/templates_percentage/getPercentage",
  TemplateController.getPercentageTemplate
);

// This will update SOAP template
router.post("/templates/narrative", TemplateController.addNarrativeTemplate);

// This will get SOAP template data
router.get(
  "/templates_narrative/getNarrative",
  TemplateController.getNarrativeTemplate
);

// This will update a single template by id
router.put("/templates_update/:id", TemplateController.updateNewTemplateById);

//export default router;
module.exports = router;
