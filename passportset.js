const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20");
const keys=require('./keys');
const User = require("../models/user");

passport.serializeUser((user,done)=>{
  done(null, user.id);
});
passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    callbackURL:'/auth/google/redirect',
    clientID:keys.google.clientID,
    clientSecret: keys.google.clientSecret,
  },
  (accessToken, refreshToken, tokens, profile, done) => {
    User.findOne({Googleid: profile.id}).then((existing_User)=>{
      if(existing_User){
        done(null,existing_User);
      } else{
        const Data = new User({
          name : profile.displayName,
          email : profile.emails[0].value,
          Googleid : profile.id,
      });
        Data.save().then((new_User)=>{
          done(null,new_User);
        })
      }
    })
  })
);
