const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, ref: 'User' },
  project_id: { type: Schema.Types.ObjectId, ref: 'Project' },
}, { timestamps: true });

module.exports = mongoose.model("Like", LikeSchema);
