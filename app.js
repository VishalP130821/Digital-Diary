//jshint esversion:6


//Requiring all packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");



//Defining constant terms
const homeStartingContent = "I'm a student persuing my Bachelor's Degeree in Information Technology at V.V.P. Engineering College, Rajkot. I love to Code and play PC Games.";
const aboutContent = "I'm a student persuing my Bachelor's Degeree in Information Technology at V.V.P. Engineering College, Rajkot. I love to Code and play PC Games.";
const contactContent = "We will be happy to help you.";

const app = express();

app.set('view engine', 'ejs');


//Using BodyParser to parse data from one file to another
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//Database connection
mongoose.connect("mongodb+srv://admin-vishal:Test123@cluster0.tqqbw.mongodb.net/blogDB", {
  useNewUrlParser: true
});


//Creating a schema for Posts
const postSchema = {
  dayNum: String,
  dateVal: Date,
  title: String,
  content: String
};

//Creating Schema for Users SigUp/Login
const userSchema = {
  name: String,
  username: String,
  password: String,
  email: String
}

const Post = mongoose.model("Post", postSchema);

const User = new mongoose.model("User", userSchema);




//Getting the home page
app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });

});



//Composing new post
app.get("/compose", function (req, res) {
  res.render("compose");
});


app.post("/compose", function (req, res) {

  const post = new Post({
    dayNum: "Day " + req.body.dayNumber,
    dateVal: req.body.dateValue,
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {

    if (!err) {

      res.redirect("/");

    } else console.log(err);

  });

  // res.redirect("/");

});



//Showing post in detail in a new page.
app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function (err, post) {
    res.render("post", {
      dayNum: post.dayNum,
      dateVal: post.dateVal,
      title: post.title,
      postID: requestedPostId,
      content: post.content
    });
  });

});



//About Section
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});



//Contact Section
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});



app.post("/edit", function (req, res) {

  const editItem = req.body.checkboxEd


});




//deleting a post.
app.post("/delete", function (req, res) {

  const deleteItemId = req.body.checkboxDel;

  Post.findByIdAndRemove(deleteItemId, function (err) {

    if (!err) {

      console.log("Item Deleted Successfully");
      res.redirect('/');
    }
  });
});





//Signing up of a user.
app.get("/sign-up", function (req, res) {
  res.render("sign-up");
});

app.post("/sign-up", function (req, res) {
  const newUser = new User({
    name: req.body.fName,
    username: req.body.UName,
    password: req.body.password,
    email: req.body.emailId
  })


  newUser.save(function (err) {
    if (!err) {
      Post.find({}, function (err, posts) {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts
        })
      });
    } else console.log(err);
  });
})



//User Login.
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  const username = req.body.fName;
  const password = req.body.lName;

  User.findOne({
    username: username
  }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password == password) {
          Post.find({}, function (err, posts) {
            res.render("home", {
              startingContent: homeStartingContent,
              posts: posts
            })
          });
        }
      } else res.render('login-fail');
    }
  })
})



//Port Connection
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


//Checking if port is listening or not!
app.listen(port, function () {
  console.log("Server started has started Successfully!");
});



/*Copyright © Vishal Pansuriya */