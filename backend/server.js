const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const taskRoutes = express.Router(); // Gets access to router
var ObjectId = require("mongoose").Types.ObjectId;
const PORT = 4000;

let Task = require("./Schemas/task.model");

/** Middleware */
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/tasks", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
});  // Connects to mongoDB database

const connection = mongoose.connection;

connection.once("open", function() {
    console.log("MongoDB database established successfully");
});


taskRoutes.route("/").get(function(req, res) {
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

taskRoutes.route("/:id").get(function(req, res) {
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

taskRoutes.route("/add").post(function(req, res) {
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


taskRoutes.route("/delete/:id").delete(function(req, res) {
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

taskRoutes.route("/update/:id").post(function(req, res) {
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



app.use("/tasks", taskRoutes); // Allows usage of database

app.listen(PORT, function() {
    console.log("Successfully running server on Port: " + PORT);
});