'use strict'

const mongoose = require('mongoose');
const scrypt = require('scrypt');
const security = require('../helper/security');
const constants = require('../helper/constants');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default : Date.now
    }
});

//Authenticate the user (Jacob)
UserSchema.statics.authenticate = function(username, password){
    return new Promise((resolve, reject)=>{
        User.findOne({'username' : username}).exec().then((result)=>{
            //There no user with that username
            if(!result){
                let err = new Error("User not found");
                err.code = constants.USER_NOT_FOUND;
                reject(err);
                return;
            }
            //Get the user hash password
            let storedHash = result.get('password');
            //Get the salt use for hashing for hashing user password
            let salt = new Buffer(result.get('salt'));
            //Generate a hash using the password and salt
            let checkHash = scrypt.hashSync(password, {N: 1024, r:8, p:16},256,salt).toString('base64');
            //Check if the two hash matches
            if(storedHash === checkHash){
                resolve(true);
            }
            else{
                resolve(false);
            }
        }).catch((err) =>{
            err.code = constants.SERVER_ERROR;
            reject(err);
        });
    });
}

//Create a new account (Visal)
UserSchema.statics.createUser = async function(username, password){
    //Generate a random salt
    let salt = security.generateRandomData(200).toString('base64');
    //Hash the password using scrypt what sha-256
    let hashPassword = await scrypt.hash(password, {N: 1024, r:8, p:16},256,salt);
    //Save all of the info to the database
    let newUser = {
        'username' : username.toLowerCase(),
        'password' : hashPassword.toString('base64'),
        'salt' : salt,
    };
    return User.create(newUser);        
}

const User = mongoose.model('User', UserSchema);
module.exports = User;

