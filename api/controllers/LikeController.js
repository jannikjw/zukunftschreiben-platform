const LikeModel = require("../models/LikeModel");
const ProjectModel = require("../models/ProjectModel");

const { param } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const injectProjectFromID = require("../middleware/injectProjectFromID");

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

function updatedProjectResponse(res, msg, project_id, user_id) {
  ProjectModel.findById(project_id)
    .populate('likes')
    // .populate('comments')
    .then((project) => {
      if (!project) {
        return apiResponse.notFoundResponse(res, "Project not found.");
      } else {
        let projectData = project.toApiRepresentation(user_id);
        return apiResponse.successResponseWithData(res, msg, projectData);
      }
    })
    .catch((err) => {
      return apiResponse.ErrorResponse(res, "Internal Server Error");
    });
}


/**
 * Create a new like for a project.
 * 
 * @returns {Object}
 */
exports.createLike = [
  authenticationRequired,
  param("project_id").isLength({ min: 1 }).trim().withMessage("Project ID must be specified."),
  rejectRequestsWithValidationErrors,
  injectProjectFromID,
  (req, res) => {
    try {
      const query = {
        author: req.user._id,
        project: req.project._id
      };
      // check whether the proejct was already liked
      LikeModel.findOne(query)
        .then(existingLike => {
          if (existingLike) {
            // user has already Liked – return success
            return updatedProjectResponse(res, "Like recorded.", req.project._id, req.user._id);
          } else {
            // else create a new like
            let like = new LikeModel(query);
            like.save()
              .then(savedLike => {
                return updatedProjectResponse(res, "Like recorded.", savedLike.project, req.user._id);
              })
              .catch(err => {
                console.log(err)
                return apiResponse.ErrorResponse(res, err);
              });
          }
        })
        .catch(err => {
          //throw error in json response with status 500. 
          return apiResponse.ErrorResponse(res, err);
        })
    } catch (err) {
      //throw error in json response with status 500. 
      return apiResponse.ErrorResponse(res, err);
    }
  }
];

/**
 * Delete a like for a project.
 * 
 * @returns {Object}
 */
exports.deleteLike = [
  authenticationRequired,
  param("project_id").isLength({ min: 1 }).trim().withMessage("Project ID must be specified."),
  rejectRequestsWithValidationErrors,
  injectProjectFromID,
  (req, res) => {
    try {
      const query = {
        author: req.user._id,
        project: req.project._id
      };
      // check whether the proejct was already liked
      LikeModel.findOne(query)
        .then(existingLike => {
          if (!existingLike) {
            // no like exists for this user and project – return success
            return updatedProjectResponse(res, "Like deleted.", req.project._id, req.user._id);
          } else {
            // else delete the like
            existingLike.remove()
              .then(deletedLike => {
                return updatedProjectResponse(res, "Like deleted.", req.project._id, req.user._id);
              })
              .catch(err => {
                return apiResponse.ErrorResponse(res, err);
              });
          }
        })
        .catch(err => {
          //throw error in json response with status 500. 
          return apiResponse.ErrorResponse(res, err);
        })
    } catch (err) {
      //throw error in json response with status 500. 
      return apiResponse.ErrorResponse(res, err);
    }
  }
];
