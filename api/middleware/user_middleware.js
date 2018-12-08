'use strict'

//Modules
const User = require('../models/user');
const Message = require('../models/message');
const sc = require('../helper/security');
const constants = require('../helper/constants');
const jwt = require('jsonwebtoken');

//Create account
function createUserAccount(req, res){
    //Check to make sure the username and password is valid
    if(req.body.username && req.body.password){
        let username = req.body.username;
        let password = req.body.password;
        User.createUser(username, password).then((newUser)=>{
            //Generate a jwt for the user that last 2 hours or 7200 seconds 
            var userToken = sc.generateJWT(newUser.username, 60);
            return res.json({
                'message': "User created",
                'username' : newUser.username,
                'jwt' : userToken
            });
        }).catch((err)=>{
            return res.json({'Error Message' : err});
        });
    }
}

//User login
function accountLogin(req, res){
    let username = req.get('username').toLowerCase();
    let password = req.get('password');
    User.authenticate(username, password).then((resolve)=>{
        if(!username || !password){
            return res.status(constants.INVALID_FORMAT).json({Message : "Missing Username or Password"});
        }
        if(resolve){
            //Create a new JWT for the user
            var userToken = sc.generateJWT(username, 500);
            return res.json({'jwt' : userToken});
        }
        else{
            return res.json(resolve);
        }

    }).catch((err) =>{
        if(err.code === constants.USER_NOT_FOUND){
            err.message = "User not found";
        }
        return res.status(err.code).json({'Error Message': err.message});
    });
}



module.exports = {
    createUserAccount,
    accountLogin,
    sendMessage,
    retrieveMessage
}