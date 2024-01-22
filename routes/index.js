var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require('./multer');


passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { nav: false });
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash('error'), nav: false });
});
//feed page
router.get('/feed', isLoggedIn, async function (req, res, next) {
  const posts = await postModel.find().populate("user");
  res.render('feed', { posts, nav: true });
});

/* Profie rout */
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts");
  res.render('profile', { user, nav: true })
});

/* Add Post rout */
router.get('/addpost', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  res.render('addpost', { user, nav: true })
});

//creating post
router.post('/addpost', isLoggedIn, upload.single("postImage"), async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const post = await postModel.create({
    user: user._id,
    posttitle: req.body.posttitle,
    description: req.body.description,
    postimage: req.file.filename
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile')
});

//register rout without password
router.post('/register', function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname })

  //register rout with password
  userModel.register(userData, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/feed');
      })
    })
})

//login rout
router.post("/login", passport.authenticate("local", {
  successRedirect: "/feed",
  failureRedirect: "/login",
  failureFlash: true
}), function (req, res) { });
//logout rout
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/");
  })
})

//uploading photo rout
router.post("/upload", isLoggedIn, upload.single("file"), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send("No Files Were Given");
  }

  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename
  await user.save();
  res.redirect("/profile");

})

//authentication middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


module.exports = router;
