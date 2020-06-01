const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true, default: 'hidden' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    author: { type: String, required: true },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ProjectSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'project'
});

ProjectSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'project'
});



ProjectSchema.method("toApiRepresentation", function (user) {
  let obj = this.toObject();
  obj.author = user._id;
  obj.username = user.username;
  return obj;
});



module.exports = mongoose.model("Project", ProjectSchema);