const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Project = require("../models/project");
const Task = require("../models/task");
const Team = require("../models/team");
const User = require("../models/user");
const router = express.Router();

// Middleware for authentication check
const authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect("/login"); // Redirect to login if not authenticated
	} else {
		next(); // Proceed to the next middleware or route handler
	}
};

// POST methods

// Add a new task and link it to a project
router.post("/add-task", (req, res) => {
	const newTask = new Task({
		task_name: req.body.task_name,
		status: req.body.status,
		description: req.body.description,
		startdate: req.body.startdate,
		enddate: req.body.enddate,
		users: req.body.userarray,
	});

	// Find the project by ID and add the new task to its task list
	Project.findById(req.body.pjid).then((project) => {
		project.tasks.push(newTask._id);
		project.save();
	});

	// Save the new task and redirect to the project page
	newTask
		.save()
		.then(() => {
			res.redirect(`/team/${req.body.teamid}/project/${req.body.pjid}`);
		})
		.catch((err) => console.log(err));
});

// Add a new project
router.post("/add-project-to-db", (req, res) => {
	const newProject = new Project({
		project_name: req.body.pjname,
		category: req.body.category,
		description: req.body.description,
		startdate: req.body.startdate,
		enddate: req.body.enddate,
	});

	// Find the team by ID and add the new project to its project list
	Team.findById(req.body.teamid).then((team) => {
		team.projects.push(newProject._id);
		team.save();
	});

	// Save the new project and redirect to the team page
	newProject
		.save()
		.then(() => {
			res.redirect(`/team/${req.body.teamid}`);
		})
		.catch((err) => console.log(err));
});

// Get task details and render the task detail page
router.post("/project/task/detail/:id", async (req, res) => {
	const task = await Task.findById(req.params.id);
	User.find().then((users) => {
		res.render("task", {
			taskdata: task,
			userwhole: users,
			pjid: req.body.pjid,
		});
	});
});

// Create a new team
router.post("/team", async (req, res) => {
	// Ensure the user array is an array and add the current user to it
	if (!Array.isArray(req.body.userarray)) {
		req.body.userarray = [req.body.userarray];
	}
	req.body.userarray.push(req.user.id);

	const newTeam = new Team({
		team_name: req.body.team_name,
		users: req.body.userarray,
	});

	// Save the new team and update users with the new team ID
	newTeam
		.save()
		.then(async () => {
			for (let userId of req.body.userarray) {
				let user = await User.findById(userId);
				user.teamids.push(newTeam._id);
				user.save();
			}
			res.redirect(`/`);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
