
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");
const User = require("../models/user");
const router = express.Router();

const authcheck = (req, res, next) => {
  // next()
  if(!req.user){
    res.redirect('/login');
  }else{
    next();
  }
};



//POST methods

//Adding task. Creates new task and link it to Project.task[] array. (Push object id of task)
router.post("/add-task", (req, res) => {
  const Data = new Task({
    task_name: req.body.task_name,
    status: req.body.status,
    description: req.body.description,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    users: req.body.userarray,
  });
  Project.findById(req.body.pjid).then((data) => {
    data.tasks.push(Data.id);
    data.save();
  });
  Data.save()
    .then(() => {
      res.redirect(`/team/${req.body.teamid}/project/${req.body.pjid}`);
    })
    .catch((err) => console.log(err));
});
//Adding new project
router.post("/add-project-to-db", (req, res) => {
  const Data = new Project({
    project_name: req.body.pjname,
    category: req.body.category,
    description: req.body.description,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });
  Team.findById(req.body.teamid).then((data) => {
    data.projects.push(Data.id);
    data.save();
  });
  Data.save()
    .then(() => {
      res.redirect(`/team/${req.body.teamid}`);
    })
    .catch((err) => console.log(err));
});

//endpoint for task detail
router.post("/project/task/detail/:id", async (req, res) => {
  const taskdata = await Task.findById(req.params.id);
  User.find().then((data) => {
    res.render("task", {
      taskdata: taskdata,
      userwhole: data,
      pjid: req.body.pjid,
      
    });
  });
});

//endpoint for creating team
router.post("/team", async (req, res) => {
  if (Array.isArray(req.body.userarray) === false){
		req.body.userarray = [req.body.userarray]
  }
  req.body.userarray.push(req.user.id);
  const Data = new Team({
    team_name: req.body.team_name,
    users: req.body.userarray,
  });
  Data.save()
    .then(async () => {
    if (Array.isArray(req.body.userarray)=== false) {
      let useradd = await User.findById(req.body.userarray);
      useradd.teamids.push(Data._id);
      useradd.save();
    } else {
      for (let i = 0; i < req.body.userarray.length; i++) {
        let useradd = await User.findById(req.body.userarray[i]);
        useradd.teamids.push(Data._id);
        useradd.save();
      }
    }
      res.redirect(`/`);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
