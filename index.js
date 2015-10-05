var express = require('express'), app = express(), port = 3000;

app.get('/', function(req, res){
  res.setHeader("Content-Type", "text/html");
  res.sendFile(__dirname + '/public/html/home.html');
});

app.get('/dashboard', function(req, res){
  res.sendFile(__dirname + "/public/html/dashboard.html");
});

app.get('/search', function(req, res){
  res.sendFile(__dirname + "/public/html/search.html");
});

app.get('/profile', function(req, res){
  res.sendFile(__dirname + "/public/html/profile.html");
});

app.use(express.static(__dirname + '/public'));

app.listen(port);


console.log("listen on port 3000");