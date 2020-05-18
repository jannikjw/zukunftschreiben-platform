const ProjectModel = require("../models/ProjectModel");

const { body, query, param } = require("express-validator");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const authenticationOptional = require("../middleware/authenticationOptional");

const apiResponse = require("../helpers/apiResponse");

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); //false to use native findOneAndUpdate()

/**
 * Create a new Project.
 *
 * @param {string}      title
 * @param {string}      url
 *
 * @return {Project}}
 */
exports.createProject = [
  authenticationRequired,
  body("title", "Title is required.")
    .isLength({ min: 1, max: 100 })
    .withMessage("The title needs to be between 1 and 100 characters long.")
    .trim(),
  rejectRequestsWithValidationErrors,
  async (req, res) => {
    try {
      let project = ProjectModel({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        status: req.body.status,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        author: req.user._id,
        username: req.user.username,
      });

      const savedProject = await project.save();

      let projectData = savedProject.toApiRepresentation(req.user._id);
      return apiResponse.successResponseWithData(
        res,
        "Project successfully created",
        projectData
      );

    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];