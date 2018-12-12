'use strict'

const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    senderUsername:{
        type: String,
        required : true,
    },
    receiverUsername: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default : Date.now
    }
});

//Save send message to database (Visal)
MessageSchema.statics.saveMessage = function(senderUsername, receiverUsername, senderMessage){
    let newMessage = {
        'senderUsername' : senderUsername.toLowerCase(),
        'receiverUsername' : receiverUsername.toLowerCase(),
        'message' : senderMessage
    };
    return Message.create(newMessage);
}

//Get messages from the server (Visal)
MessageSchema.statics.getMessages = async function(receiverUsername){
    return new Promise((resolve, reject)=>{
        //Check if there any messages in the database with the provided receiver username
        Message.find({'receiverUsername' : receiverUsername}).exec().then((result)=>{
            resolve(result);
        }).catch((err)=>{
            reject(err);
        });
    });
}

//Delete message from the server database (Jacob)
MessageSchema.statics.deleteMessages = async function(messagesID){
    return new Promise((resolve, reject) =>{
        var mongodb = require('mongodb');
        //Delete a messaage using the given id
        Message.deleteOne({'_id' : new mongodb.ObjectID(messagesID)}).exec().then((result)=>{
            resolve(result);
        }).catch((err) =>{
            reject(err);
        });
    })
}

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

