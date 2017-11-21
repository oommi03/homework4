var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken')
var itemRouter = require('./routers/item');
var Item = require('./models/item')

var app = express();
var PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');

mongoose.connect('mongodb://oommi:123456789@ds113566.mlab.com:13566/customer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())

// app.use('/', itemRouter);
app.use('/api', itemRouter);
app.route('/')
.get(function (request, response) {

  Item.find(function (error, user) {

    if (error) {
      response.status(500).send(error);
      return;
    }

    console.log(user);
    response.render('index', {
      title: 'Welcome',
      users: user
    });
    // response.json(user);
  });
});

app.route('/authenticate').post(function (req, res) {
  // find the user
  Item.findOne({
    name: req.body.name
  }, function (err, user) {

    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {

      // check if password matches
      if (user.name != req.body.name) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
          name: user.name
        };
        var token = jwt.sign(payload, 'superSecret', {
          expiresIn: 1440 // expires in 24 hours
        });
        res.cookie('token', token)
        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

app.route('/login')
.get((req, res) => {
  res.render('login')
})

app.listen(PORT, function () {
 
});
