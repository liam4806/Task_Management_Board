const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const http = require("http");
const socketIO = require("socket.io");

const keys = require("./configuration/keys");
const passportSetup = require("./configuration/passportset");
const Team = require("./models/team");

const authRoutes = require("./routes/auth-routes");
const getRoutes = require("./routes/getmeth");
const addRoutes = require("./routes/addmeth");
const updateRoutes = require("./routes/updatemeth");
const deleteRoutes = require("./routes/deletemeth");
const profileRoutes = require("./routes/profile");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Setting up socket.io with the server
require("./socket/friend")(io);

// Connecting to MongoDB
mongoose.connect(keys.mongodb.urlforDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); // Handling connection errors
db.once("open", () => {
	console.log("Database connected"); // Log once the database connection is open
});

// Middleware setup
app.use(express.static("public")); // Serve static files from the "public" directory
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride("_method")); // Override HTTP methods to support PUT and DELETE

// Session management with MemoryStore
app.use(
	session({
		secret: keys.session.key,
		resave: false,
		saveUninitialized: true,
		store: new MemoryStore({
			checkPeriod: 86400000, // Prune expired entries every 24h
		}),
		cookie: { maxAge: 86400000 }, // Set cookie expiration to 24h
	})
);
app.use(passport.initialize()); // Initialize passport for authentication
app.use(passport.session()); // Use passport session

// Route handlers
app.use("/auth", authRoutes); // Authentication routes
app.use("/team", getRoutes); // Routes for fetching teams
app.use("/add", addRoutes); // Routes for adding teams
app.use("/update", updateRoutes); // Routes for updating teams
app.use("/delete", deleteRoutes); // Routes for deleting teams
app.use("/profile", profileRoutes); // Profile routes

// Middleware to check authentication
const authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect("/login"); // Redirect to login if not authenticated
	} else {
		next(); // Proceed if authenticated
	}
};

// Home route - display project lists dynamically
app.get("/", authCheck, async (req, res) => {
	const teams = await Team.find({}); // Fetch all teams from the database
	const userTeams = [];

	// Filter teams that the authenticated user is part of
	for (let team of teams) {
		if (req.user.teamids.includes(team._id)) {
			const populatedTeam = await Team.findById(team._id).populate("projects"); // Populate the projects field
			userTeams.push(populatedTeam); // Add team to the user's teams
		}
	}

	res.render("home", { teams: userTeams }); // Render the home view with the user's teams
});

// Login page route
app.get("/login", (req, res) => {
	res.render("login"); // Render the login view
});

// Profile page route
app.get("/profile", authCheck, (req, res) => {
	res.render("profile", { user: req.user }); // Render the profile view with the authenticated user's data
});

// Start the server
server.listen(3000, () => {
	console.log("Serving on port 3000"); // Log when the server starts
});
