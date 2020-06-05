const DonationModel = require("../models/DonationModel");
const { body } = require("express-validator");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");
const injectProjectFromID = require("../middleware/injectProjectFromID");


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
    .custom(amount => {
      if (amount < 5) { throw new Error('The Donation Amount needs to be at least 5€') }
    })
    .trim(),
  rejectRequestsWithValidationErrors,
  injectProjectFromID,
  async (req, res) => {
    try {
      let donation = DonationModel({
        author: req.user._id,
        project: req.project._id,
        amount: Math.round(req.body.amount * 100)
      });

      const savedDonation = await donation.save();

      ProjectModel.findById(savedDonation.project)
        .populate('donations')
        .then((project) => {
          if (!project) {
            return apiResponse.notFoundResponse(res, "Project not found.");
          } else {
            let projectData = project.toApiRepresentation(user_id);
            return apiResponse.successResponseWithData(res, msg, projectData);
          }
        })

    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];