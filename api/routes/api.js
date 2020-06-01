var express = require("express");
var authRouter = require("./authRouter");
var projectRouter = require("./projectRouter");
var likeRouter = require("./likeRouter");

var app = express();

app.use("/auth/", authRouter);
app.use("/project/", projectRouter);
app.use("/like/", likeRouter)

module.exports = app;
