const ProjectModel = require("../models/ProjectModel");
const apiResponse = require("../helpers/apiResponse");

const injectProjectFromID = (req, res, next) => {

  // make sure to validate req.params.project_id before running this middleware
  ProjectModel.findById(req.params.project_id)
    // .populate('likes')
    // .populate('comments')
    .then((project) => {
      if (!project) {
        return apiResponse.notFoundResponse(res, "Project not found.");
      } else {
        req.project = project;
        next();
      }
    })
    .catch((err) => {
      // make sure an invalid id doesn't crash the server
      return apiResponse.notFoundResponse(res, "Project not found.");
    });
}

module.exports = injectProjectFromID;
