const config = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const memberRoutes = require("./routes/MemberRoutes");
const clientRoutes = require("./routes/ClientRoutes");
const eventRoutes = require("./routes/EventRoutes");
const accountInvRoutes = require("./routes/AccountInvRoutes");
const formRoutes = require("./routes/FormRoutes");
const templateRoutes = require("./routes/TemplateRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const emailRoutes = require("./routes/EmailRoutes");
const cognitoRoutes = require("./routes/CognitoRoutes");

// import config from "dotenv";
// import express from "express";
// import bodyParser from "body-parser";
// import memberRoutes from "./routes/MemberRoutes";
// import clientRoutes from "./routes/ClientRoutes";
// import eventRoutes from "./routes/EventRoutes";
// import accountInvRoutes from "./routes/AccountInvRoutes";
// import formRoutes from "./routes/FormRoutes";
// import templateRoutes from "./routes/TemplateRoutes";

config.config();

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.use("/members", memberRoutes);
app.use("/clients", clientRoutes);
app.use("/events", eventRoutes);
app.use("/accounts", accountInvRoutes);
app.use("/forms", formRoutes);
app.use("/templates", templateRoutes);
app.use("/messages", messageRoutes);
app.use("/categories", categoryRoutes);
app.use("/email", emailRoutes);
app.use("/cognito", cognitoRoutes);

// when a random route is inputed
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to this API.",
  })
);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

//export default app;
module.exports = app;
