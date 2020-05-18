const apiResponse = require("../helpers/apiResponse");
const ProjectModel = require("../models/ProjectModel");

// this middleware will throw an error, if the user accessing a post is not the author 
const isAdmin = (req, res, next) => {
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id)
      if (user.admin === true) {
        return next
      }
    } catch (err) {
      return apiResponse.notFoundResponse(res, 'No post was found that matches that ID');
    }
  }
}
  ;

module.exports = isAuthor;
