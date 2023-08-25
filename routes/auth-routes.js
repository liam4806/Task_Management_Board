const router = require('express').Router();
const passport = require('passport');

//logout
router.get('/logout', (req,res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});
//Google auth
router.get('/google', passport.authenticate('google',{
    scope:['profile','email']
}));

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;