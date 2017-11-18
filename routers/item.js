var express = require('express');
var Item = require('../models/item');
var jwt=require('jsonwebtoken');

var itemRouter = express.Router();

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
      // response.json(user);
    });
  });

itemRouter
  .route('/user')
  .post(function (request, response) {

    console.log('POST /users');

    var user = new Item(request.body);
    
    user.save();
    // response.status(201).send(user)
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
      // response.json(user);
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
          // response.status(200).json({
          //   'message': 'Item with id ' + userId + ' was removed.'
          // });
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
        // response.json(user);
        return;
      }

      response.status(404).json({
        message: 'Item with id ' + userId + ' was not found.'
      });
    });
  })

module.exports = itemRouter;