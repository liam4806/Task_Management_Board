 const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");
const User = require("../models/user");
const res = require("express/lib/response");
const router = express.Router();

const authcheck = (req, res, next) => {
    // next();
  if(!req.user){
    res.redirect('/login');
  }else{
    next();
  }
};


//Adding project page
router.get("/add_project/:teamid", authcheck, (req, res) => {
  res.render("add_project", { teamid: req.params.teamid });
});

//Detail view of certain project. Display the tasks in that project
router.get("/:teamid/project/:pjid", authcheck, async (req, res) => {
  const projects = await Project.findById(req.params.pjid).populate("tasks");
  const userdata = [];
  for (let i = 0; i < projects.tasks.length; i++) {
    let newstart = projects.tasks[i].startdate.toISOString().substring(0, 10);
    let newend = projects.tasks[i].enddate.toISOString().substring(0, 10);
    let userobj = {
      id: projects.tasks[i].id,
      task_name: projects.tasks[i].task_name,
      status: projects.tasks[i].status,
      description: projects.tasks[i].description,
      startdate: newstart,
      enddate: newend,
      users: await Promise.all(
          projects.tasks[i].users.map((userId) => User.findById(userId))
        )
    };
    userdata.push(userobj);
  }
  Project.findById(req.params.pjid).then((data) => {
    res.render("taskwithprog", {
      teamid: req.params.teamid,
      pjid: req.params.pjid,
      projdata: data,
      taskdata: userdata,
      options: ["To Do", "In Progress", "Completed"],
    });
  });
});
//endpoint for adding task
router.get("/:teamid/project/task/:id", authcheck, async (req, res) => {
  const team = await Team.findById(req.params.teamid);
  const teamusers = team.users;
  const teamarr = [];
  User.find().then((data) => {
    res.render("add_task", {
      pjid: req.params.id,
      teamid: req.params.teamid,
      userwhole: data,
      teamusers: teamusers,
      options: ["To Do", "In Progress", "Completed"],
    });
  });
});

router.get("/:teamid/project/:pjid/task/:id", authcheck, async (req, res) => {
  const taskdata = await Task.findById(req.params.id);
  const team = await Team.findById(req.params.teamid);
  const teamusers = team.users;
  const teamarr = [];
  User.find().then((data) => {
    data.forEach((user) => {
      if (teamusers.includes(user.id)) {
        let teamuserobj = {
          id: user.id,
          name: user.name,
        };
        teamarr.push(teamuserobj);
      }
    });
    res.render("task", {
      taskdata: taskdata,
      users: teamarr,
      pjid: req.params.pjid,
      teamid: req.params.teamid,
      options: ["To Do", "In Progress", "Completed"],
    });
  });
});

router.get("/create", authcheck, (req, res) => {
  User.find()
    .then((data) => {
      res.render("teamcreate", { userdata: data });
    })
    .catch((err) => console.log(err));
});

router.get("/:id", authcheck, async (req, res) => {
  //find that business using req.params
  const team = await Team.findById(req.params.id).populate("projects");
  const userss = await User.find({});
  const users = []
  for(let i=0;i<userss.length;i++){
    if(team.users.includes(userss[i].id)){
      let userobj={
        id:userss[i].id,
        name:userss[i].name,
      } 
      users.push(userobj)
    }else{
      continue
    }
  }
  res.render("projectlist", { team: team, users: users,});
});

module.exports = router;
