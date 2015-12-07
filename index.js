var express = require('express'), app = express(), port = 3456;
var expbars = require('express-handlebars');
var request = require('request');
var session  = require('express-session');
var cfg = require('./config')
var QueryString = require('querystring');

var db = require('./db')
var Users = require('./models/users')


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

app.use(express.static(__dirname + '/public'));

app.use(function(err,req,res,next){
  res.status(err.status || 500);
  if(err == "The access token provided is invalid." || err == "The access_token provided is invalid."){
    res.redirect('/');
  return;
  }
  var error;
  if(!err.message) error = err;
  else error = err.message;
  res.render('error',{
    message: error,
    error: {}
    });
});

app.get('/', function(req, res){
  res.render('home');
});

app.post('/', function(req, res) {
  var user = req.body
  console.log(user)
  Users.insert(user, function(result) {
    req.session.userId = result.ops[0]._id
    res.redirect('/profile')
  });
})


app.get('/profile', function(req, res) {
  if (req.session.userId) {
    //Find user
    Users.find(req.session.userId, function(document) {
      if (!document) return res.redirect('/')
      //Render the update view
      res.render('profile', {
        user: document
      })
    })
  } else {
    res.redirect('/')
  }
})



app.post('/profile', function(req, res) {
  var user = req.body
  console.log(user)
  id=req.session.userId
  console.log(req.session.userId)
    //Update the user
  Users.update(id, function() {
    //Render the update view again
    res.render('profile', {
      user: user,
      success: 'Successfully updated the user!'
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

app.get('/search', function(req, res) {
  if (req.session.userId) {
    //Find user
    Users.find(req.session.userId, function(document) {
      if (!document) return res.redirect('/')
      //Render the update view
      res.render('search', {
        user: document
      });
    });
  } else {
    res.redirect('/')
  }
})

app.post('/search/saveSearch', function(req, res) {
  var tag = req.body.tag
  var userId = req.session.userId
  //Add the tag to the user
  Users.addTag(userId, tag, function() {
    res.redirect('/search')
  })
})

app.post('/search/removeSearch', function(req, res) {
  var tag = req.body.tag
  var userId = req.session.userId
  //Add the tag to the user
  Users.removeTag(userId, tag, function() {
    res.redirect('/search')
  })
})



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
    var data = {};
    try{
      data = JSON.parse(body);
    }
    catch(err){
      return next(err)
    }
    console.log("DATA", data);
    var user = data.user
    var names = user.full_name.split(" ");
    var website = user.website;
    var bio = user.bio;
    user.fname = names[0];
    user.lname = names[1];
    user.website = website;
    user.bio = bio
    user._id = user.id;
    var temp;
    Users.find(data.user.id, function(doc){
      if(!doc){
        Users.insert(user, function(result) {
          //no-op
        });
      }
    });
    req.session.userId = data.user.id;
    req.session.access_token = data.access_token;
    res.redirect("/dashboard");
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

db.connect('mongodb://bendata:asdfasdf123@ds055574.mongolab.com:55574/bendata', function(err) {
  // console.log(err)
  if (err) {
    //console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})

app.listen(port);

//console.log("listen on port 3000");


// app.get('/profile', function(req, res, next){
//   var options = {
//     url: "https://api.instagram.com/v1/users/self/?access_token=" + req.session.access_token
//   };
//   var user = User.find()
//   request.get(options, function(error, response, body) {
//     try {
//       var user = JSON.parse(body);
//       user._id = user.id;
//       Users.insert(user, function(result) {
//         req.session.userId = result.ops[0]._id;
//       });
//       if (user.meta.code > 200) {
//         return next(user.meta.error_message);
//       }
//     }
//     catch(err) {
//       return next(err);
//     }

//     res.render('profile', {
//       name: user.data.full_name,
//       profilePicture: user.data.profile_picture,
//       followers: user.data.counts.followed_by
//     });
//   });
// });
