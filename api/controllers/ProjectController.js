const ProjectModel = require("../models/ProjectModel");
const UserModel = require("../models/UserModel");

const { body } = require("express-validator");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const authenticationOptional = require("../middleware/authenticationOptional");

const apiResponse = require("../helpers/apiResponse");

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); //false to use native findOneAndUpdate()

/**
 * Create a new Project.
 *
 * @return {Project}}
 */
exports.createProject = [
  authenticationRequired,
	body("title", "Title is required.")
		.isLength({ min: 1, max: 100 })
		.withMessage("The title needs to be between 1 and 100 characters long.")
		.trim(),
	(req, res) => {  
		try {
			let project = ProjectModel({
				title: req.body.title,
				description: req.body.description,
        category: req.body.category,
        hidden: req.body.hidden,
				startDate: new Date(req.body.startDate),
				endDate: new Date(req.body.endDate),
				author: req.user._id,
        image: req.body.image,
        username: req.user.username,
        fundingGoal: new Number(req.body.fundingGoal),
        likes: 0,
			});
      
      project.save()
        .then(response => {
          return apiResponse.successResponseWithData(
            res,
            "Project successfully created",
            response
          )
        })
        .catch(err => {console.log(err);return apiResponse.ErrorResponse(res, err)})
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

exports.getProject = [
	authenticationRequired,
	(req, res) => {
		try {
			const query = {_id : req.body.id};
			ProjectModel.findOne(query, (err, Project) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }
				else {
					return apiResponse.successResponseWithData(res,"Account confirmed.", Project);
				}
			});
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
      const user_id = req.user ? req.user._id : null
      let isAdmin = false
      if (user_id) {
        isAdmin = await UserModel.findById(user_id)
          .then((user) => user.isAdmin)
          .catch(e => console.log(e))
      }

      if (isAdmin) {
        ProjectModel.find({}, null, {
          populate: ['likes', 'donations']
        })
          .sort({ endDate: -1 })
          .then((projects) => {
            const projectsData = projects.map(p => p.toApiRepresentation(user_id));
            apiResponse.successResponseWithData(res, "Projects retrieved.", projectsData);
          })
      }
      else {
        ProjectModel.find({ status: "shown" }, null, {
          populate: ['likes', 'donations']
        })
          .sort({ endDate: -1 })
          .then((projects) => {
            const projectsData = projects.map(p => p.toApiRepresentation(user_id));
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