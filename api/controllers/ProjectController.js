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
  body("description").isLength({ min: 1 }).trim().withMessage("Description must be specified."),
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

exports.updateProject = [
  authenticationRequired,
	body("title", "Title is required.")
		.isLength({ min: 1, max: 100 })
		.withMessage("The title needs to be between 1 and 100 characters long.")
    .trim(),
  body("description").isLength({ min: 1 }).trim().withMessage("Description must be specified."),
	(req, res) => {  
		try {
      let projectData = {
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
			};
			ProjectModel.findOneAndUpdate({_id: req.body.id}, projectData, (err, data) => {
				if (err) {  return apiResponse.ErrorResponse(res, err); }
				return apiResponse.successResponseWithData(res, "Updated Project!", data);
      });
		} 
		catch (err) {
			console.log(err)
			// return apiResponse.ErrorResponse(res, err);
		}
	},
];

exports.getProject = [
	authenticationRequired,
	(req, res) => {
		try {
			const query = {_id : req.params.id};
			ProjectModel.findOne(query, (err, Project) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }
				else {
					return apiResponse.successResponseWithData(res,"Project Found", Project);
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

exports.deleteProject = [
	// authentication
	authenticationRequired,
	(req, res) =>  {
		try {
			ProjectModel.findOneAndDelete({ _id: req.body.id}, (err, project) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }
				return apiResponse.successResponse(res, "Deleted the project from Database.");
			})
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		} 
	}];


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
            const projectData = projects.map(p => p.toApiRepresentation(user_id));
            const data = {
              projectData: projectData,
              isAdmin: isAdmin
            }
            apiResponse.successResponseWithData(res, "Projects retrieved.", data);
          })
      }
      else {
        ProjectModel.find({ hidden: false }, null, {
          populate: ['likes', 'donations']
        })
          .sort({ endDate: -1 })
          .then((projects) => {
            const projectData = projects.map(p => p.toApiRepresentation(user_id));
            const data = {
              projectData: projectData,
              isAdmin: isAdmin
            }
            apiResponse.successResponseWithData(res, "Projects retrieved.", data);
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