//import { Router } from "express";
const express = require("express");
var router = express.Router();
//import AccountInvController from "../controllers/AccountInvController";
const AccountInvController = require("../controllers/AccountInvController");
//const router = Router();

// get accounts table
router.post("/accountspr", AccountInvController.getAllAccountsParam);
// get account details
router.post("/accountdetailsbe", AccountInvController.getDetailAccountsBE);
// list of transactions
router.get("/transactions", AccountInvController.getAllTransactions);
//  distinct list of payors
router.get("/payors", AccountInvController.getDistinctPayors);
// get invoices
router.get("/invoices", AccountInvController.getAllInvoices);
// delete one transaction
router.delete("/transactions/:id", AccountInvController.deleteOneTransaction);
// delete many transactions
router.post(
  "/transactions/deleteMany",
  AccountInvController.deleteManyTransactions
);
// add transaction
router.post("/addtransactions", AccountInvController.addTransaction);
// add invoice manually
router.post("/manualinvoices", AccountInvController.addManualInvoice);

//export default router;
module.exports = router;
