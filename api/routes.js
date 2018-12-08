'use strict'

const userMiddleware = require('./middleware/user_middleware');
const bcrypt = require('bcrypt');

function routing(router){

    router.route('/').get(function(req, res){
        res.json({message : 'Welcome To ABConversation P2P Encrypted Chat'});
    });

    //Create an account for the user
    router.route('/signup').post(function(req, res){
        userMiddleware.createUserAccount(req, res);
    });

    //Login user with
    router.route('/login').get(function(req, res){
        userMiddleware.accountLogin(req, res);
    });

    //User send message
    router.route('/message').post(function(req, res){
        userMiddleware.sendMessage(req, res);
    });

    //User retrieve message
    router.route('/message').get(function(req, res){
        userMiddleware.retrieveMessage(req, res);
    });

    return router;

}

module.exports = routing;