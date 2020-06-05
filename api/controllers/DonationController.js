const DonationModel = require("../models/DonationModel");
const ProjectModel = require("../models/ProjectModel");

const { body } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const injectProjectFromID = require("../middleware/injectProjectFromID");



function updateProjectResponse(res, msg, project_id, user_id) {
  ProjectModel.findById(project_id)
    .populate('donations')
    // .exec((err, project) => { if (err) console.log(err); })
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
 * Create a new Donation.
 *
 * @param {float}      amount
 *
 * @return {Donation}}
 */
exports.createDonation = [
  authenticationRequired,
  body("amount", "Donation Amount is required.")
    .isDecimal()
    .withMessage("The Donation Amount needs to be a decimal value")
    // .custom(amount => {
    //   console.log(parseFloat(amount))
    //   if (parseFloat(amount) < 5.00) { throw new Error() }
    // })
    .withMessage('The Donation Amount needs to be at least 5€')
    .trim(),
  rejectRequestsWithValidationErrors,
  injectProjectFromID,
  (req, res) => {
    try {
      let donation = DonationModel({
        author: req.user._id,
        project: req.project._id,
        amount: Math.round(req.body.amount * 100)
      });
      donation.save()
        .then(savedDonation => {
          return updateProjectResponse(res, 'Donation of ' + (savedDonation.amount / 100).toFixed(2) + '€ recorded.', savedDonation.project, req.user._id)
        })
        .catch(err => { return apiResponse.ErrorResponse(res, err) })
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];