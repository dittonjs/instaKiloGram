var express = require('express'), app = express(), port = 3000;
var expbars = require('express-handlebars');
var Request = require('request');
var session  = require('express-session');
var cfg = require('./config')
var QueryString = require('querystring');


app.engine('handlebars', expbars({defaultLayout: "base"}));
app.set("view engine", "handlebars");

app.use(session({
  cookieName : 'session',
  secret: 'asdf;alskjdfa;lskfj',
  resave: false,
  saveUninitialized: true
}))

app.get('/', function(req, res){
  res.render('home', {
    title: "This is weird",
    name: "Joseph",
  });
});

app.get('/authorize', function(req, res){
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: "code"
  };
  var query = QueryString.stringify(qs);
  var url = "https://api.instagram.com/oauth/authorize/?" + query;
  res.redirect(url);
});

app.get("/auth/finalize", function(req, res){
  var post = {
    client_id: cfg.client_id,
    client_secret: cfg.client_secret,
    redirect_uri: cfg.redirect_uri,
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
    req.session.access_token = data.access_token;
    res.redirect("/feed");
  });

});

app.get('/feed',function(req,res){
  var options={
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + req.session.access_token
  }
})

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
