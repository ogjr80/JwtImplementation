var express = require('express'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser'); 
var morgan = require('morgan'); 
//var jwt = require('jwt-simple'); 
var jwt = require('./services/jwt'); 





mongoose.connect('mongodb://localhost:27017/jwtDB', function(){
    console.log('database connection established successfully'); 
}); 

mongoose.Promise = global.Promise; 


var app = express(); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan()); 

var User = require('./models/user'); 

app.post('/register', function(req, res, next){
    var user = req.body; 
    var newUser = new User({
        email:user.email, 
        password:user.password
    }); 


    var payload = {
        iss: req.hostname, 
        sub: user._id
    }

    var token = jwt.encode(payload, 'myScret'); 

    newUser.save(function(err, user){
        if(err) return next(err); 
        res.status(200).send({newUser: user, userToken: token}); 
    })
})


app.get('/getusers', function(req, res, next){
    User.find({}, function(err, users){
        if(err) return next(err); 
        res.json(users); 
    })
})



app.listen(3000, function(){
    console.log('app now running on port 3000'); 
})