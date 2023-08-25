
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
  if(!req.user){
    res.redirect('/login');
  }else{
    next();
  }
};

//PUT method
router.put("/project/:id", (req, res) => {
  Project.findById(req.params.id).then((data) => {
    data.project_name = req.body.pjname;
    data.category = req.body.category;
    data.description = req.body.description;
    if (req.body.startdate) {
      data.startdate = req.body.startdate;
    } else {
      data.startdate = data.startdate;
    };
    if (req.body.enddate) {
      data.enddate = req.body.enddate;
    } else {
      data.enddate = data.enddate;
    };
    data
      .save()
      .then(() => {
        res.redirect(`/team/${req.body.teamid}`);
      })
      .catch((err) => console.log(err));
  });
});
//updating project.
router.put("/:teamid/project/:pjid/task/:id", (req, res) => {
  Task.findById(req.params.id).then((data) => {
    data.task_name = req.body.taskname;
    data.status = req.body.status;
    data.description = req.body.description;
    data.users = req.body.users;
    data.startdate=req.body.startdate;
    data.enddate=req.body.enddate;
    data
      .save()
      .then(() => {
        res.redirect(`/team/${req.params.teamid}/project/${req.params.pjid}`);
      })
      .catch((err) => console.log(err));
  });
});
//updating task
router.put("/project/:pjid/task/:id", (req, res) => {
  Task.findById(req.params.id).then((data) => {
    data.task_name = req.body.taskname;
    data.status = req.body.status;
    data.description = req.body.description;
    data.startdate = req.body.startdate;
    data.enddate = req.body.enddate;
    data.users = req.body.users;
    data
      .save()
      .then(() => {
        res.redirect(`/team/project/${req.params.pjid}`);
      })
      .catch((err) => console.log(err));
  });
});
router.put("/:teamid", (req, res) => {
  Team.findById(req.params.teamid).then((data) => {
    data.team_name = req.body.team_name;
    data.users = req.body.users;
    data.save().then(() => {
      res.redirect(`/team/${req.params.teamid}`);
    });
  });
});

module.exports = router;
