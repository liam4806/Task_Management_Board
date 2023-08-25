const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Project = require("./project");
const TaskSchema = new Schema({
  task_name: String,
  status: String,
  description: String,
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

//To deleted reference ObjectIds in Project.tasks when we delete the task too.
// TaskSchema.pre("findOneAndDelete", async function (next) {
//   try {
//     const taskId = this._conditions._id;
//     const projects = await mongoose
//       .model("Project")
//       .updateMany({ tasks: taskId }, { $pull: { tasks: taskId } });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
module.exports = mongoose.model("Task", TaskSchema);
