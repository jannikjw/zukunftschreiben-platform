var express = require("express");
var authRouter = require("./authRouter");
var projectRouter = require("./projectRouter");

var app = express();

app.use("/auth/", authRouter);
app.use("/project/", projectRouter);

module.exports = app;
