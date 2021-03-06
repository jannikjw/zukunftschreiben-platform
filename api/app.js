const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');

// load environment variables from .env file
require("dotenv").config();

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const apiResponse = require("./helpers/apiResponse");

// setup the connection to MongoDB
const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { 
		useNewUrlParser: true, 
		useCreateIndex: true, 
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		// don't show the log when it is test
		if(process.env.NODE_ENV !== "test") {
			console.log("Connected to %s", MONGODB_URL);
			console.log("App is running ... \n");
			console.log("Press CTRL + C to stop the process. \n");
		}
	})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});

const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}

// app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({limit: "10mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

module.exports = app;
