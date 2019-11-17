const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');

mongoose.set('useFindAndModify', false);
const bsRoutes = express.Router(); // Gets access to router
var ObjectId = require("mongoose").Types.ObjectId;
const PORT = 4000;

let Task = require("./Schemas/task.model");
let User = require("./Schemas/user.model");

/** Middleware */
app.use(cors());
app.use(bodyParser.json());
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));

mongoose.connect("mongodb://127.0.0.1:27017/bsDb", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});  // Connects to mongoDB database

const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database established successfully");
});

/** Tasks Server CRUD Begin */

/**
 * Retrieves task list
 */
bsRoutes.route("/task/list").get(function(req, res) {
    Task.find(function(err, tasks) {
        if (err) {
            console.log(err);
            res.status(400).send("Retrieving tasks failed!");
            return;
        }
        else {
            res.status(200).json(tasks);
            return;
        }
    });
});

/**
 * Retrieves specific task information
 */
bsRoutes.route("/task/:id").get(function(req, res) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Not a valid ID: " + req.params.id);   
        return;
    }

    Task.findById(req.params.id, function(err, task) {
        if(err) {
            console.log(err);
            res.status(400).send("Retrieving Task failed!");
            return;
        }
        if(task) { // Found
            res.status(200).json(task);
            return;
        }
        else {
            res.status(500).send("No record with given ID : " + req.params.id);
            return;
        }
    });
});

/**
 * Adds task
 */
bsRoutes.route("/task/add").post(function(req, res) {
    let task = new Task(req.body);
    task.save()
        .then(task => {
            res.status(200).json({'task': 'task added successfully'});
            return;
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("Adding new task failed!");
            return;
        });
});

/**
 * Deletes task
 */
bsRoutes.route("/task/delete/:id").delete(function(req, res) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Not a valid ID: " + req.params.id);
        return;
    }
    
    Task.findByIdAndRemove(req.params.id, function(err, task) {
        if(!task) {
            res.status(404).send("Task is not found");
            return;
        }
        if(task) {
            res.status(200).json({'task': 'task deleted successfully'});
            return;
        }
        else {
            res.status(500).send("No record with given ID : " + req.params.id);
            return;
        }   
    });
});

/**
 * Updates task
 */
bsRoutes.route("/task/update/:id").post(function(req, res) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Not a valid ID: " + req.params.id);
        return;
    }
    
        
    Task.findById(req.params.id, function(err, task) {
        if(!task) {
            res.status(404).send("Task is not found");
            return;
        }
        else {
            task.taskDescription = req.body.taskDescription;
            task.taskResponsible = req.body.taskResponsible;
            task.taskPriority = req.body.taskPriority;
            task.taskComplete = req.body.taskComplete;
            
            task.save().then(task => {
                res.json("Task updated!");
                return;
            })
            .catch(err => {
                res.status(400).send("Update not possible");
                return;
            });
        }   
    });
});

/** Tasks Server CRUD End */

/** User Server CRUD Begin */

/**
 * Retrieves user list
 */
bsRoutes.route("/user/list").get(function(req, res) {
    User.find(function(err, tasks) {
        if (err) {
            console.log(err);
            res.status(400).send("Retrieving users failed!");
            return;
        }
        else {
            res.status(200).json(tasks);
            return;
        }
    });
});

/**
 * Retrieves specific user information
 */
bsRoutes.route("/user/:id").get(function(req, res) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Not a valid ID: " + req.params.id);   
        return;
    }

    User.findById(req.params.id, function(err, task) {
        if(err) {
            console.log(err);
            res.status(400).send("Retrieving User failed!");
            return;
        }
        if(task) { // Found
            res.status(200).json(task);
            return;
        }
        else {
            res.status(500).send("No user with given ID : " + req.params.id);
            return;
        }
    });
});

/**
 * Adds user
 */
bsRoutes.route("/user/add").post(function(req, res) {

    var username = req.body.userUsername;

    var query = {};
    query['userUsername'] = username;

    User.findOne(query, { userUsername: 1 }, 
        function (err, info) {
            if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Error!', err);
            res.status(500).send("Error!");
            return;
            }

            if(info) { // Username found...
                console.log(info)
                res.status(200).json({'user': 'Username Taken'});
                return;
            }
            else {
                let user = new User(req.body);
                user.save()
                    .then(user => {
                        res.status(200).json({'user': 'user added successfully'});
                        return;
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).send("Adding new user failed!");
                        return;
                    });
            }
    });
});

/**
 * Updates user
 */
bsRoutes.route("/user/update/:id").post(function(req, res) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Not a valid ID: " + req.params.id);
        return;
    }
    
        
    User.findById(req.params.id, function(err, user) {
        if(!user) {
            res.status(404).send("User is not found");
            return;
        }
        else {
            user.userFirstName = req.body.userFirstName;
            user.userLastName = req.body.userLastName;
            user.username = req.body.username;
            user.password = req.body.password;
            user.userTeams = req.body.userTeams;
            user.userAdmins = req.body.userAdmins;
            
            user.save().then(user => {
                res.json("User updated!");
                return;
            })
            .catch(err => {
                res.status(400).send("Update not possible");
                return;
            });
        }   
    });
});


/**
 * Deletes user (Can't just put it in, need to also remove from groups)
 */
bsRoutes.route("/user/delete/:id").delete(function(req, res) {
    if(!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Not a valid ID: " + req.params.id);
        return;
    }
    
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if(!user) {
            res.status(404).send("User is not found");
            return;
        }
        if(user) {
            res.status(200).json({'user': 'user deleted successfully'});
            return;
        }
        else {
            res.status(500).send("No record with given ID : " + req.params.id);
            return;
        }   
    });
});

/**
 * Adds user
 */
bsRoutes.route("/admin/login").post(function(req, res) {
    var username = req.body.userUsername;
    var password = req.body.userPassword;

    var query = {};
    query['userUsername'] = username;

    User.findOne(query, { userUsername: 1, userPassword: 1}, 
        function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Login error!', err);
                res.status(500).send("Login error!");
                return;
            }

        if(info) {
            if(password === info.userPassword) {
                req.session.user_id = info._id;
                req.session.username = info.userUsername;

                res.status(200).send("Login success!");
                return;
            }
            else {
                res.status(400).send("Incorrect password!");
                return;
            }
        }
        else {
            res.status(200).send("Username not found!");
            return;
        }
    });
    
});


/** User Server CRUD End */



app.use("/bsDb", bsRoutes); // Allows usage of database

app.listen(PORT, function() {
    console.log("Successfully running server on Port: " + PORT);
});