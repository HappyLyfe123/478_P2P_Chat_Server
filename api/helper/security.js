'use strict'

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const constants = require("./constants");

//Generat a random bytes according to the specific length (Visal)
function generateRandomData(dataLength){
    return crypto.randomBytes(dataLength);
}

//Generate a JWT token (Visal)
function generateJWT(username, expiredTime){
    return jwt.sign({id : username}, process.env.JWT_SECRET_KEY,{
        expiresIn : expiredTime});
}

//Get the user info from token (Jacob)
function verifyUserToken(userToken){
    return new Promise((resolve, reject)=>{
        jwt.verify(userToken, process.env.JWT_SECRET_KEY, function(err, result){
            if(err){
                err.message = "JWT Expired";
                err.code = constants.NO_MESSAGE_FOUND
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
}

module.exports = {
    generateRandomData,
    generateJWT,
    verifyUserToken,
}
