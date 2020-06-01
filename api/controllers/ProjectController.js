const ProjectModel = require("../models/ProjectModel");
const UserModel = require("../models/UserModel");

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


/**
 * Get all projects.
 *
 * @return {Object}}
 */
exports.getAll = [
  authenticationOptional,
  rejectRequestsWithValidationErrors,
  async (req, res) => {
    try {
      req.user = req.user ? req.user : null
      let isAdmin = false
      isAdmin = await UserModel.findById(req.user._id)
        .then((user) => user.isAdmin)
        .catch(e => console.log(e))

      if (req.user && isAdmin) {
        ProjectModel.find()
          .sort({ createdAt: -1 })
          .then((projects) => {
            let projectsData = projects.map(p => p.toApiRepresentation(req.user._id));
            apiResponse.successResponseWithData(res, "Projects retrieved.", projectsData);
          })
      }
      else {
        ProjectModel.find({ status: 'shown' })
          .sort({ createdAt: -1 })
          .then((projects) => {
            let projectsData = projects.map(p => p.toApiRepresentation(req.user._id));
            apiResponse.successResponseWithData(res, "Projects retrieved.", projectsData);
          })
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * Update own Project.
 * 
 *  @return {Project}
 */
exports.update = [
  authenticationRequired,
  rejectRequestsWithValidationErrors,
  (req, res) => {
    try {
      ProjectModel.findByIdAndUpdate(req.params.project_id)
        .then(project => {

          project.save()
            .then(() => res.json('Project updated.'))
            .catch(err => res.status(400).json('Error: ' + err))
        })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];