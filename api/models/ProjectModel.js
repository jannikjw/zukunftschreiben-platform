const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		category: { type: String, required: true },
		hidden: { type: Boolean, required: true, default: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		author: { type: String, required: true },
		image: { type: String, required: true },
		username: { type: String, required: true },
		fundingGoal: { type: Number, required: true },
		likes: { type: Number, required: true, default: 0 },
		comments: { type: [String], required: false }
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

ProjectSchema.method("toApiRepresentation", function (user) {
	let obj = this.toObject();
	obj.author = user._id;
	obj.username = user.username;
	return obj;
});

ProjectSchema.method("updateLastInteraction", function () {
	return;
});

module.exports = mongoose.model("Project", ProjectSchema);