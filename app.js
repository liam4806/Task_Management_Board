const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Team = require("./models/team");
const keys = require("./configuration/keys");
const passportSet = require("./configuration/passportset");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const authRoute = require("./routes/auth-routes");
const getRoute = require("./routes/getmeth");
const addRoute = require("./routes/addmeth");
const updateRoute = require("./routes/updatemeth");
const deleteRoute = require("./routes/deletemeth");
mongoose.connect(
  keys.mongodb.urlforDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  require("express-session")({
    secret: keys.session.key,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: { maxAge: 86400000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//route for auth
app.use("/auth", authRoute);
//route for get
app.use("/team", getRoute);
//route for add
app.use("/add", addRoute);
//route for update
app.use("/update", updateRoute);
//route for delete
app.use("/delete", deleteRoute);


const authcheck= (req,res,next)=>{
  if(!req.user){
    res.redirect('/login');
  }else{
    next();
  }
}


//endpoint for home '/', display Project lists dynamically
app.get("/", authcheck, async (req, res) => {
  const teams = await Team.find({});
  const arrr = [];
  for (let i = 0; i < teams.length; i++){
    if(req.user.teamids.includes(teams[i]._id)){
          const teamp = await Team.findById(teams[i]._id).populate("projects");
          arrr.push(teamp);
    }else{
      continue
    }

  };
  res.render("home",{ teams: arrr});

});

//Login page
app.get("/login", (req, res) => {
  res.render("login");
});
//profile
app.get("/profile", authcheck, async (req,res) =>{
  res.render("profile",{user:req.user})
})


app.listen(3000, () => {
  console.log("Serving on port 3000");
});
