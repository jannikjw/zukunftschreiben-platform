var express = require("express");
var authRouter = require("./authRouter");
var projectRouter = require("./projectRouter");
var likeRouter = require("./likeRouter");
var donationRouter = require("./donationRouter");

var app = express();

app.use("/auth/", authRouter);
app.use("/project/", projectRouter);
app.use("/like/", likeRouter)
app.use("/donate/", donationRouter)

module.exports = app;
