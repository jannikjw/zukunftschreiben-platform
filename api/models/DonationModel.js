const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Donation", DonationSchema);
