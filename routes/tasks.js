var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
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


/* GET home page with all incomplete exercises */
router.get('/user/:_id/tasklist', function(req, res, next) {

    console.log("exercise list")

    Task.find( { user: req.user._id, completed: false})
        .then( (docs) => {



            res.render('/user/' + _id + '/tasklist', {title: 'Exercise List', tasks: docs})
        })
        .catch( (err) => {
            next(err);
        });

});

/* GET details about one exercise */

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
                res.status(404).send('Exercise not found');
            }
            else if ( req.user._id.equals(task.user)) {
                // Does this task belong to this user?
                res.render('task', {title: 'Task', task: task});
            }
            else {
                // Not this user's task. Send 403 Forbidden response
                res.status(403).send('This is not your exercise, you may not view it');
            }
        })
        .catch((err) => {
            next(err);
        })

});


/* POST new exercise */
router.post('/user/:_id/tasklist/add', function(req, res, next){

    var _id = req.params._id;
    console.log("Add exercise for user id " + _id)

    if (!req.user || !req.body || !req.body.text) {
        //no task text info, redirect to home page with flash message
        req.flash('error', 'please enter an exercise');
        res.redirect('user/' + _id +  '/tasklist');
    }

    else {

        // Insert into db. New tasks are assumed to be not completed.
        var dateCreated = new Date();
        // Create a new Task, an instance of the Task schema, and call save()
        new Task( { user: _id , text: req.body.text, completed: false, dateCreated: new Date()} ).save()
            .then((newTask) => {
                console.log('The new exercise created is: ', newTask);
                res.redirect('/user/' + _id + '/tasklist');
            })
            .catch((err) => {
                next(err);   // most likely to be db error.
            });
    }
});



/* POST exercise delete */
router.post('/user/:user_id/tasklist/task/:task_id/delete', function(req, res, next){
     var user_id = req.params.user_id;
    var task_id = req.params.task_id;
    Task.deleteOne( { user: user_id, _id: task_id})//, task : task_id, text: req.body.text } )
        .then( (result) => {
            console.log('deleted task')
            console.log(result);
            if (result.deletedCount === 1) {  // one task document deleted
                res.redirect('/user/' + user_id + '/tasklist');

            } else {
                // The task was not found. Report 404 error.
                res.status(404).send('Error deleting exercise: not found');
            }
        })
        .catch((err) => {
            next(err);   // Will handle invalid ObjectIDs or DB errors.
        });


});


module.exports = router;