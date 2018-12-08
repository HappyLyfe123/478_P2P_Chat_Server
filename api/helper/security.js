'use strict'

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function generateRandomData(dataLength){
    return crypto.randomBytes(dataLength);
}

//Generate a JWT token
function generateJWT(username, expiredTime){
    return jwt.sign({id : username}, process.env.JWT_SECRET_KEY,{
        expiresIn : expiredTime});
}

function verifyToken(req, res, next){
    
}

module.exports = {
    generateRandomData,
    generateJWT,
    verifyToken,
}
