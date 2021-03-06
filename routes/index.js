var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Task = require('../models/task');


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

/* GET home page. */
router.get('/', function(req, res, next) {

    User.find().select( { first: 1, last: 1, description : 1 } ).sort( { last: 1 } )
        .then( ( docs ) => {
            console.log(docs);
            res.render('index', { title: "Client List", user: docs });
        } ).catch ((err) => {
        next(err)
    });
});


/* POST to create new client */
router.post('/user/add', function(req, res, next) {

    // Use form data to make a new client, save to DB
    var user = User(req.body);

    // Form data to match schema

    User.profile = {
        first: req.body.first,
        last: req.body.last,
        sex: req.body.sex,
        age: req.body.age,
        height: req.body.height,
        weight: req.body.weight,
        heart: req.body.heart,
        notes: req.body.notes,
        datesUpdate: req.body.datesUpdate
    };

    user.save()
        .then( (doc) => {
            console.log(doc);
            res.redirect('/')
        })
        .catch( (err) => {
            if (err.name === 'ValidationError') {
                // Check for validation errors

                req.flash('error', err.message);
                res.redirect('/');
            }
            else {
                // Not either of these? Pass to generic error handler to display 500 error
                next(err);
            }
        });
});

/* POST to delete 1 client. */
router.post('/user/:_id/delete', function(req, res, next){    //Delete button is added here

    User.deleteOne( { _id : req.body._id } )
        .then( (result) => {
            if (result.deletedCount === 1) {
                res.redirect('/');
            } else {
                // The task was not found. Report 404 error.
                res.status(404).send('Error deleting user: not found');
            }
        })
        .catch((err) => {
            next(err);   // Will handle invalid ObjectIDs or DB errors.
        });
});

/* POST modify 1 client. */
router.post('/user/:_id/modUser', function(req, res, next) {
    console.log(req.body)  //New route for the modify button
    User.findOneAndUpdate( {_id: req.body._id}, {$set: {first: req.body.first, last:req.body.last,
        sex: req.body.sex, age: req.body.age, height: req.body.height, weight: req.body.weight,
        heart: req.body.heart, notes: req.body.notes, datesUpdate: req.body.datesUpdate }})

        .then((modifiedUser) => {
            if (modifiedUser) {   // Name of the document before the update
                res.redirect('/')  // After the update, redirect to home
            } else {
                // if it cannot update the task, get a 404 error
                res.status(404).send("Error modifying this user");
            }
        }).catch((err) => {
        next(err);
    })
});

// GET info about 1 client
router.get('/user/:_id', function(req, res, next) {

    User.findOne( { _id:  req.params._id})
        .then( (doc) => {
            if (doc) {
                res.render('user', { user: doc });

            } else {
                res.status(404);
                next(Error("User not found"));
            }
        })
        .catch( (err) => {
            next(err);
        });
});
// GET info about 1 client, connect to their exercise list
router.get('/user/:_id/tasklist', function(req, res, next) {

    Task.find( { user :  req.params._id})
        .then( (docs) => {
            if (docs) {
                res.render('tasklist', { user_id: req.user._id, tasks : docs });

            } else {
                res.status(404);
                next(Error("User not found"));
            }
        })
        .catch( (err) => {
            next(err);
        });
});
module.exports = router;