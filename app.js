var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var itemRouter = require('./routers/item');

var app = express();

var PORT = 3000;

app.set('view engine', 'ejs');

mongoose.connect('mongodb://oommi:123456789@ds113566.mlab.com:13566/customer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', itemRouter);

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
