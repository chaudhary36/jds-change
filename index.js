var express = require('express');
var router = express.Router();
var userModel = require('./users')
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const postModel = require("./post");
const admitModel = require("./admit");

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/faculty" , isLoggedIn, async function(req , res){
  res.render("faculty")
})

router.get("/index" , async function(req , res){
  res.render('index');
})



router.post("/register", function (req, res) {
  const { username, fullname, email } = req.body;
  const userData = new userModel({ username, fullname, email});

  userModel.register(userData , req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/index")
    })
  });
});


router.get("/register" , function(req ,res){
  res.render("register")
})

router.get("/login" , function(req, res){
  res.render("login")
})

router.post("/login", passport.authenticate("local", {
  successRedirect: '/index',
  failureRedirect: '/register',
}), function (req, res){
});

router.get("/logout", function(req, res){
  req.logout(function(err){
    if (err) { return next(err); }
    res.redirect('/');
  })
});

function isLoggedIn (req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/register')
};




router.get("/contact" , isLoggedIn, async function(req, res){
  res.render("contact");
});



router.get("/about" , isLoggedIn, async function(req, res){
  
  res.render('about');
});


// const user = await userModel.findOne({
//   username: req.session.passport.user
// })
// res.render('faculty', {user});


router.get("/admission" , isLoggedIn, function(req , res){
  res.render('admission')
})


router.post('/admissions', async (req, res) => {
  try {
    // Extract data from the request body
    const {
      name,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      phoneNumber,
      gender,
      dob,
      address,
      class: studentClass,
      previousSchool,
    } = req.body;

    // Create a new Admission instance
    const newAdmission = new admitModel({
      name,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      phoneNumber,
      gender,
      dob,
      address,
      class: studentClass,
      previousSchool,
    });

    // Save the admission record to the database
    await newAdmission.save();

   res.render("success")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



module.exports = router;
