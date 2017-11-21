var express = require('express');
var Item = require('../models/item');
var jwt=require('jsonwebtoken');

var itemRouter = express.Router();
itemRouter.use(function (req, res, next) {
  
    // check header or url parameters or post parameters for token
    var token = req.cookies.token || req.body.token || req.query.token || req.headers['x-access-token'];
  
    // decode token
    if (token) {
  
      // verifies secret and checks exp
      jwt.verify(token, 'superSecret', function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
  
    } else {
  
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
  
    }
  });

itemRouter
  .route('/')
  .get(function (request, response) {

    Item.find(function (error, user) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(user);
      response.render('index',{
        title: 'Welcome',
        users: user
      });
      
    });
  });

itemRouter
  .route('/user')
  .post(function (request, response) {

    console.log('POST /users');

    var user = new Item(request.body);
    
    user.save();
    
    response.redirect('/');
  })
  .get(function (request, response) {

    console.log('GET /users');

    Item.find(function (error, user) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(user);
      response.render('get',{
        title: 'Customer',
        users: user
      });
     
    });
  });

itemRouter
  .route('/user/:userId')
  .get(function (request, response) {

    console.log('GET /users/:userId');

    var userId = request.params.userId;

    Item.findOne({ id: userId }, function (error, user) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      console.log(user);

      response.json(user);

    });
  })
  .post(function (request, response) {

    console.log('DELETE /users/:userId');

    var userId = parseInt(request.body.id);

    Item.findOne({ id: userId }, function (error, user) {
      if (error) {
        response.status(500).send(error);
        return;
      }

      if (user) {
        user.remove(function (error) {

          if (error) {
            response.status(500).send(error);
            return;
          }
          response.redirect('/');

        });
      } else {
        response.status(404).json({
          message: 'Item with id ' + userId + ' was not found.'
        });
      }
    });
  });
  itemRouter
  .route('/user/:userId/change')
  .post(function (request, response) {

    console.log('PUT /users/:userId');

    var userId = parseInt(request.body.id);

    Item.findOne({ id: userId }, function (error, user) {

      if (error) {
        response.status(500).send(error);
        return;
      }

      if (user) {
        user.name = request.body.name;
        user.age = request.body.age;
        user.email = request.body.email;
        user.save();
        response.redirect('/');
    
        return;
      }

      response.status(404).json({
        message: 'Item with id ' + userId + ' was not found.'
      });
    });
  })

module.exports = itemRouter;