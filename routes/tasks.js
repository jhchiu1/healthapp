var express = require('express');
var router = express.Router();
var Task = require('../models/task');
var ObjectId = require('mongoose').mongo.ObjectId;



/* Middleware, to verify if the user is authenticated */
function isLoggedIn(req, res, next) {
    console.log('user is auth ', req.user)
    if (req.isAuthenticated()) {
        res.locals.username = req.user.local.username;
        next();
    } else {
        res.redirect('/auth');
    }
}

/* Apply this middleware to every route in the file, so don't need to
specify it for every router */

router.use(isLoggedIn);


/* GET home page with all incomplete tasks */
router.get('/user/:_id/tasklist', function(req, res, next) {

    Task.find( { user: req.user._id, completed: false})
        .then( (docs) => {
            res.render('/user/:_id/tasklist', {title: 'Incomplete Tasks', tasks: docs})
        })
        .catch( (err) => {
            next(err);
        });

});


/* GET details about one task */

router.get('/task/:_id', function(req, res, next) {

    /* This route matches URLs in the format task/anything
    Note the format of the route path is  /task/:_id
    This matches task/1 and task/2 and task/3...
    Whatever is after /task/ will be available to the route as req.params._id

    For our app, we expect the URLs to be something like task/1234567890abcdedf1234567890
    Where the number is the ObjectId of a task.
    So the req.params._id will be the ObjectId of the task to find
    */

    Task.findOne({_id: req.params._id} )
        .then( (task) => {

            if (!task) {
                res.status(404).send('Task not found');
            }
            else if ( req.user._id.equals(task.user)) {
                // Does this task belong to this user?
                res.render('task', {title: 'Task', task: task});
            }
            else {
                // Not this user's task. Send 403 Forbidden response
                res.status(403).send('This is not your task, you may not view it');
            }
        })
        .catch((err) => {
            next(err);
        })

});


/* GET completed tasks */
router.get('/user/:_id/tasklist/completed', function(req, res, next){

    Task.find( {user: req.user._id, completed:true} )
        .then( (docs) => {
            res.render('user/:_id/tasklist/completed', { title: 'Completed tasks' , tasks: docs });
        }).catch( (err) => {
        next(err);
    });

});


/* POST new task */
router.post('/user/:_id/task/tasklist/add', function(req, res, next){

    if (!req.user || !req.body || !req.body.text) {
        //no task text info, redirect to home page with flash message
        req.flash('error', 'please enter a task');
        res.redirect('user/:_id/tasklist');
    }

    else {

        // Insert into database. New tasks are assumed to be not completed.
        var dateCreated = new Date();
        // Create a new Task, an instance of the Task schema, and call save()
        new Task( { user: req.user, task: req.user._id, text: req.body.text, completed: false, dateCreated: new Date()} ).save()
            .then((newTask) => {
                console.log('The new task created is: ', newTask);
                res.redirect('/user/:_id/tasklist');
            })
            .catch((err) => {
                next(err);   // most likely to be a database error.
            });
    }
});


/* POST task done */
router.post('/user/:_id/tasklist/done', function(req, res, next) {

    // Is this is the user's task?

    Task.findOneAndUpdate( { user: req.user._id, _id: req.body._id}, {$set: {completed: true, dateCompleted: new Date()}} )
        .then((updatedTask) => {
            if (updatedTask) {   // updatedTask is the document *before* the update
                res.redirect('/')  // One thing was updated. Redirect to home
            } else {
                // if no updatedTask, then no matching document was found to update. 404
                res.status(404).send("Error marking task done: not found");
            }
        }).catch((err) => {
        next(err);
    })
});


/* POST all tasks done */
router.post('/user/:_id/tasklist/alldone', function(req, res, next) {

    Task.updateMany( { user: req.user._id, completed : false } , { $set : { completed : true, dateCompleted: new Date()} } )
        .then( (result) => {
            console.log("How many documents were modified? ", result.n);
            req.flash('info', 'All tasks marked as done!');
            res.redirect('/user/:_id/tasklist/alldone');
        })
        .catch( (err) => {
            next(err);
        })

});


/* POST task delete */
router.post('/user/:_id/tasklist/delete', function(req, res, next){

    Task.deleteOne( { user: req.user._id, _id : req.body._id } )
        .then( (result) => {

            if (result.deletedCount === 1) {  // one task document deleted
                res.redirect('/user/:_id/tasklist/delete');

            } else {
                // The task was not found. Report 404 error.
                res.status(404).send('Error deleting task: not found');
            }
        })
        .catch((err) => {
            next(err);   // Will handle invalid ObjectIDs or DB errors.
        });

});

module.exports = router;