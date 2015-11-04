var express = require('express'), app = express(), port = 3000;
var expbars = require('express-handlebars');
var Request = require('request');

var QueryString = require('querystring');

var ACCESS_TOKEN = "";
var CLIENT_ID = "720599ea1bce43a1807b2c56b16a10ba";
var CLIENT_SECRET = "d028e757b070441f8dd412acfd6b2a36";
var REDIRECT_URI = "http://127.0.0.1:3000/auth/finalize";

app.engine('handlebars', expbars({defaultLayout: "base"}));
app.set("view engine", "handlebars");

app.get('/', function(req, res){
  res.render('home', {
    title: "This is weird",
    name: "Joseph",
  });
});

app.get('/authorize', function(req, res){
  var qs = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code"
  };
  var query = QueryString.stringify(qs);
  var url = "https://api.instagram.com/oauth/authorize/?" + query;
  res.redirect(url);
});

app.get("/auth/finalize", function(req, res){
  var post = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    code: req.query.code
  }

  var options = {
    url: "https://api.instagram.com/oauth/access_token",
    form: post
  }

  Request.post(options, function(error, response, body){
    console.log(body);
    var data = JSON.parse(body);
    ACCESS_TOKEN = data.access_token;
    res.redirect("/feed");
  });

});

app.get('/profile', function(req, res){
  res.render('profile', {
    title: "This is weird",
    name: "Joseph",
  });
});

app.get('/dashboard', function(req, res){
  res.render('dashboard', {
    title: "This is weird",
    name: "Joseph",
    posts: [{
      img: "img",
      likes: 10,
      comments: 10,
    },{
      img: "img",
      likes: 10,
      comments: 10,
    },{
      img: "img",
      likes: 10,
      comments: 10,
    },{
      img: "img",
      likes: 10,
      comments: 10,
    },{
      img: "img",
      likes: 10,
      comments: 10,
    },{
      img: "img",
      likes: 10,
      comments: 10,
    }]
  })
});

app.get('/search', function(req, res){
    res.render('home', {
    title: "This is weird",
    name: "Joseph",
  })
});

// app.get('/profile', function(req, res){
//   res.sendFile(__dirname + "/public/html/profile.html");
// });

app.use(express.static(__dirname + '/public'));

app.listen(port);


console.log("listen on port 3000");