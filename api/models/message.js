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

//Save send message to database
MessageSchema.statics.saveMessage = function(senderUsername, receiverUsername, senderMessage){
    let newMessage = {
        'senderUsername' : senderUsername.toLowerCase(),
        'receiverUsername' : receiverUsername.toLowerCase(),
        'message' : senderMessage
    };
    return Message.create(newMessage);
}



const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

