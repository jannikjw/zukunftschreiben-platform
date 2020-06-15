const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, ref: 'User' },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project' },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Donation", DonationSchema);
