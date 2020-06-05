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
    goal: { type: Number, required: true }
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

ProjectSchema.virtual('donations', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'project'
});



ProjectSchema.method("toApiRepresentation", function (user_id) {
  apiRepresentation = {}

  apiRepresentation._id = this._id;
  apiRepresentation.author = this.author;
  apiRepresentation.username = this.username;
  apiRepresentation.title = this.title;
  apiRepresentation.description = this.description;
  apiRepresentation.category = this.category;
  apiRepresentation.status = this.status;
  apiRepresentation.startDate = this.startDate;
  apiRepresentation.endDate = this.endDate;
  apiRepresentation.likes = this.likes ? this.likes.length : 0;
  apiRepresentation.userHasLiked = false
  if (this.likes && user_id) {
    apiRepresentation.userHasLiked = this.likes.find(l => l.author == user_id) ? true : false;
  }
  apiRepresentation.funding = 0;
  if (this.donations) {
    apiRepresentation.funding = (this.donations
      .map(d => d.amount)
      .reduce((sum, current) => sum + current, 0) / 100).toFixed(2)
  }
  apiRepresentation.goal = this.goal;
  return apiRepresentation;
});



module.exports = mongoose.model("Project", ProjectSchema);