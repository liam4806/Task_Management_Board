
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");
const router = express.Router();

const authcheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/login');
  }else{
    next();
  }
};
async function projdelete(project) {
    for(let i=0; i<project.tasks.length; i++){
    await Task.findByIdAndDelete({_id: project.tasks[i]._id});
    };
}
//Delete method
router.delete("/:teamid/project/:id", async (req, res) => {
    const project = await Project.findById(req.params.id);
    projdelete(project);
    const { teamid, id } = req.params;
      await Team.findByIdAndUpdate(teamid, {
        $pull: { projects: id },
      });
    await Project.findByIdAndDelete({ _id: req.params.id });
    res.redirect(`/team/${req.params.teamid}`);
});

router.delete("/task/:id/:taskid", async (req, res) => {
  const { id, taskid } = req.params;
  await Project.findByIdAndUpdate(id, {
    $pull: { tasks: taskid },
  });
  await Task.findByIdAndDelete({ _id: taskid });
  res.redirect(req.get("referer"));
});

router.delete("/team/:id", async (req, res) => {
    const team= await Team.findById(req.params.id);
    for(let i=0; i<team.projects.length; i++){
        const project = await Project.findById(team.projects[i]);
        projdelete(project);
        await Project.findByIdAndDelete({ _id: team.projects[i]._id });
    }
    await Team.findByIdAndDelete({_id: req.params.id});
    res.redirect("/");

});

module.exports = router;
