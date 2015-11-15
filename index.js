var express = require('express'), app = express(), port = 3000;
var expbars = require('express-handlebars');
var request = require('request');
var session  = require('express-session');
var cfg = require('./config')
var QueryString = require('querystring');


app.engine('handlebars', expbars({defaultLayout: "base"}));
app.set("view engine", "handlebars");

app.use(session({
  cookieName : 'session',
  secret: 'asdf;alskjdfa;lskfj',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000
  }
}));

app.get('/', function(req, res){
  res.render('home', {
    title: "This is weird",
    name: "Joseph",
  });
});

app.get('/index', function(req, res){
  res.render('index', {
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

app.get("/auth/finalize", function(req, res, next){

  if(req.query.error =='access_denied'){
  return res.redirect('/');

}
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

  request.post(options, function(error, response, body){
    //console.log(body);
    try{var data = JSON.parse(body);}
    catch(err){
      return next(err)
    }

    req.session.access_token = data.access_token;
    res.redirect("/dashboard");
  });
});

app.get('/profile', function(req, res){
  res.render('profile', {
    title: "This is weird",
    name: "Joseph",
  });
});

app.get('/dashboard', function(req, res, next){
  var options={
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + req.session.access_token + "&count=8"
  }
  request.get(options, function(error, response, body) {
    try {
      var dashboard = JSON.parse(body);
      if (dashboard.meta.code > 200) {
        return next(dashboard.meta.error_message);
      }
    }
    catch(err) {
      return next(err);
    }

    res.render('dashboard', {
      title: "This is weird",
      name: "Joseph",
      dashboard: dashboard.data
    });
  });
});

app.get('/search', function(req, res, next){
    if(req.query.content){
      var options = { 
        url: "https://api.instagram.com/v1/tags/"+req.query.content+"/media/recent?count=10&access_token=" + req.session.access_token
      };
      
      request.get(options, function(error, response, body){
        try {
          var content = JSON.parse(body);
          if (content.meta.code > 200) {
            return next(content.meta.error_message);
          }
        }
        catch(err) {
          return next(err);
        }
        console.log(content);

        res.render('search', {
          content: content.data
        });

      });
    } else {
      res.render('search', {
        content: []
      });
    }

});


app.use(express.static(__dirname + '/public'));

app.use(function(err,req,res,next){
  res.status(err.status || 500);
  if(err == "The access token provided is invalid." || err == "The access_token provided is invalid."){
    res.redirect('/');
  return;
  }
  var error;
  if(!err.message) error = err;
  else error = error.message;
  res.render('error',{
    message: error,
    error: {}
    });
});

app.listen(port);

console.log("listen on port 3000");
