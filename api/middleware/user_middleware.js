'use strict'

//Modules
const User = require('../models/user');
const Message = require('../models/message');
const sec = require('../helper/security');
const constants = require('../helper/constants');
const jwt = require('jsonwebtoken');

//Create account (Visal Hok)
function createUserAccount(req, res){
    //Check to make sure the username and password is valid
    if(req.body.username && req.body.password){
        let username = req.body.username;
        let password = req.body.password;
        User.createUser(username, password).then((newUser)=>{
            //Generate a jwt for the user that last 2 hours or 7200 seconds 
            var userToken = sec.generateJWT(newUser.username, 60);
            return res.json({
                'message': "User created",
                'username' : newUser.username,
                'jwt' : userToken
            });
        }).catch((err)=>{
            console.log(err.code);
            return res.json({'Error Message' : err});
        });
    }
}

//User login (Jacob)
function accountLogin(req, res){
    let username = req.get('username').toLowerCase();
    let password = req.get('password');
    //Check if the provided info is valid
    User.authenticate(username, password).then((resolve)=>{
        //Check if username or password empty
        if(!username || !password){
            return res.status(constants.INVALID_FORMAT).json({Message : "Missing Username or Password"});
        }
        if(resolve){
            //Create a new JWT for the user
            var userToken = sec.generateJWT(username, 500);
            return res.json({'jwt' : userToken});
        }
        else{
            return res.json(resolve);
        }

    }).catch((err) =>{
        //No user with that username is found
        if(err.code === constants.USER_NOT_FOUND){
            err.message = "Invalid Username or Passwrod";
        }
        return res.status(err.code).json({'Error Message': err.message});
    });
}

//Save message being send from a user to another users (Visal)
function sendMessage(req, res){
    let token = req.get('Authorization');
    //Verify if the user have a valid token
    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, result){
        if(err){
            return res.json({'Error Message' : err});
        }
        let senderUsername = result.id;
        let receiverUsername = req.body.receiverUsername;
        let saveMessage = req.body.message;
        Message.saveMessage(senderUsername, receiverUsername, saveMessage).then((newMessage)=>{
            return res.json({"Respond Message" : "Message Saved"})
        }).catch((err)=>{
            return res.status(err.code).json({'Error Message' : err});
        });
    });

}

//Retrieve messages from the database (Visal)
function retrieveMessage(req, res){
    //Get user token
    let token = req.get('Authorization');
    //Verify user token
    sec.verifyUserToken(token).then((result)=>{
        let receiverUsername = result.id;
        Message.getMessages(receiverUsername).then((resolve)=>{
            return res.json(resolve);
        });
    }).catch((err)=>{
        return res.status(err.code).json(err);
    });
}

//Delete messages from database (Jacob)
function deleteMessages(req, res){
    //Get deleted message id
    let messagesID = req.get('id');
    //Delete message from the database using id
    Message.deleteMessages(messagesID).then((result)=>{
        if(result.n){
            return res.status(constants.MESSAGE_DELETED).json("Message Deleted");
        }
        return res.status(constants.NO_MESSAGE_FOUND).json("No Message Found");
    });
    
}

module.exports = {
    createUserAccount,
    accountLogin,
    sendMessage,
    retrieveMessage,
    deleteMessages
}