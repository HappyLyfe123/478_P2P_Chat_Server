# ABConversation Chat
Encrypted_P2P_Chat_Server is our team attemp to create a secure Node.js Server with strict Authentication/Authorization restrictions. In addtion, the server will also be able to receieve and send message to and from a user.

## Table of Contents
1. [Time Allocation](#time%201%20allocation)
2. [Requirements](#Requirements)
3. [Architecture](#Architecture)

## Time Allocations
10 Hours Server and Client Design
24 Hours Server and Client implmentation
6 Hours Documentation

## Requirements
1.[Node.js] v8.12.0
2.[npm] v6.4.1
3.TLS 1.2 or 1.3
4.Express

## Architecture

### Backend Server Framework of Choice
Node.js
We used Node.js becuase it's one of the state of the art for backend development framework. It have a wide community support.
We also use Javascrip inconjuction of Node.js. The reason why we use javascrip because it have a wide community suport and it's also the 
language that I'm familiar with.

### Security First Design
TCP Communication through SSL
* All requests being sent to and from the server first establish an SSL handshake with the current state of the art 
Cipher Suites. If the client is unable to satisfy the minimum requirements to establish a secure encrypted connection, the connection is broken.
* All unsecure HTTP requests are forwarded to an HTTPS Connection.
* Implementation of HSTS enforces users to communicate strictly through HTTPS only.

JWT (Json Web Token)
* User for user authrozation.

User Login and Account Creation
* A user's login and account creation information is always kept secure through an SSL connection.
* A user's password is kept Hashed using BCRYPT to prevent rainbow table attacks.

### Schemas

User Schema
* username : The user's username
* password : The User's hashed password
* salt : The random salt that use for password hashing
* date : The data that the account created
```
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique : true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken :{
        token: String,
        expiration: Date
    },
    refreshToken : {
        token: String,
        expiration : Date
    },
    isAdmin : {
        type : Boolean,
        required : true
    },
    annotations : {
        type : Map,
        of: Map
    }
});
```

Message Schema
* senderUsername : The sender user name
* receiverUsername : The user that the message suppose to be send to username
* message : The message that was send
* createDate : The data that the account created
```
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
```
### API For Login and Account Registration
* User account creation and login requests are all sent through an SSL tunnel for secure encrypted communication.
### API For Save and Send Messges
* User save and send message are all send through an SSL tunnel for secrure encrypted commmunication.
* The user must provide JWT in order to save or Get messgaes from database
