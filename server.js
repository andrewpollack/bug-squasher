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
let hashMethods = require("./backend/passwordHashing");

/** Middleware */
app.use(cors({
    credentials: true,
    origin:['http://localhost:3000'],
    methods:['GET','POST', 'DELETE'],
  }));
app.use(bodyParser.json());
app.use(session({secret: 'secretKey', 
                 resave: false, 
                 saveUninitialized: false,
                 cookie: { secure: false }}));
                           

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
bsRoutes.get("/task/list", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

    var query = {};
    query['userCreator'] = req.session.user_id;

    Task.find(query,function(err, tasks) {
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
bsRoutes.get("/task/:id", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

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
bsRoutes.post("/task/add", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

    let task = new Task(req.body);
    task.userCreator = req.session.user_id;
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
bsRoutes.delete("/task/delete/:id", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

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
bsRoutes.post("/task/update/:id", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

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
            
            task.save().then(newTask => {
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
bsRoutes.get("/user/list", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

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
bsRoutes.get("/user/:id", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

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
bsRoutes.post("/user/add", function(req, res) {

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
                res.status(200).json({'user': 'Username Taken'});
                return;
            }
            else {
                let user = new User(req.body);
                var passwordEntry = hashMethods.makePasswordEntry(req.body.userPassword);
                user.userPassword = "";

                user.userDigest = passwordEntry.hash;
                user.userSalt = passwordEntry.salt;

                User.create(user, function(err, newUser) {
                    if (err) {
                        res.status(400).send("Adding new user failed!");
                        return;
                    }
        
                    newUser.save(function(err) {
                        console.log(err);
                    });
                    req.session.user_id = newUser._id;
                    req.session.username = newUser.userUsername;
        
                    res.status(200).json({'result': 'Success',
                                            '_id': newUser._id,
                                            'username': newUser.userUsername})
                });
            }
    });
});

/**
 * Updates user
 */
bsRoutes.post("/user/update/:id", function(req, res) {
    if(!req.session.user_id) {
        res.status(401).send('No user login');
        return;
    }

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
            
            // Update password with sha stuff!
            
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
bsRoutes.delete("/user/delete/:id", function(req, res) {
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
 * Login user
 */
bsRoutes.post("/admin/login", function(req, res) {    

    var username = req.body.userUsername;

    var query = {};
    query['userUsername'] = username;

    User.findOne(query, { userUsername: 1, userDigest: 1, userSalt: 1 }, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Login error!', err);
                res.status(500).send("Login error!");
                return;
            }

            if(info === null) {
                res.status(200).json({'result': 'Username Not Found'});
                return;

            }
            if(!hashMethods.doesPasswordMatch(info.userDigest, info.userSalt, req.body.userPassword)) {
                res.status(200).json({'result': 'Password Incorrect'});
                return; 
            }
            req.session.user_id = info._id;
            req.session.username = info.userUsername;
            res.status(200).send(JSON.stringify({'result': 'Success',
                                    '_id': info._id,
                                     'username': info.userUsername}));
    });
});


bsRoutes.post("/admin/logout", function (req, res) {
    if(!req.session.user_id) {
        res.status(401).send('Already logged out');
        return;
    }

    if(req.session.user_id) {
        req.session.destroy(function (err) { 
            if(err) {
                res.status(400).send('Unable to logout');
                return;
            }
            else {
                res.status(200).send("Done");
                return;
            }
        });
    }
});


/** User Server CRUD End */


app.use("/bsDb", bsRoutes); // Allows usage of database

app.listen(PORT, function() {
    console.log("Successfully running server on Port: " + PORT);
});