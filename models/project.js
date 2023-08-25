const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  project_name: String,
  category: String,
  description: String,
  startdate: {
        type: Date,
    },
  enddate: {
        type : Date,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("Project", ProjectSchema);
