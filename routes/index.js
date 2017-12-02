var express = require('express');
var router = express.Router();
var Client = require('../models/client');

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

    Client.find().select( { name: 1, description : 1 } ).sort( { name: 1 } )
        .then( ( docs ) => {
        console.log(docs);
    res.render('index', { title: "All Clients", client: docs });
} ).catch ((err) => {
        next(err)
    });
});

router.post('/delete', function(req, res, next){    // Delete button added

    Client.deleteOne( { _id : req.body._id } )
        .then( (result) => {

        if (result.deletedCount === 1) {
        res.redirect('/');

    } else {
        // The client was not found. Report 404 error.
        res.status(404).send('Error deleting client: not found');
    }
})
.catch((err) => {

        next(err);   // Will handle invalid ObjectIDs or DB errors.
});
});


// POST to create new client
router.post('/addClient', function(req, res, next) {
    // Use form data to create new client save to DB
    var client = Client(req.body);
    // Form data as key value pairs
    client.nest = {
        location: req.body.nestLocation,
        materials: req.body.nestMaterials
    };
    client.save()
        .then ( (doc) => {
        console.log(doc);
    res.redirect('/')
})
.catch( (err) => {
        if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        res.redirect('/');
    }
    // else if (err.code === 11000) {
    //   req.flash('error', req.body.name + ' is already in the database.')
    //   res.redirect('/');
    // }
else {
        next(err);
    }
});
});

// GET info about 1 client
router.get('/client/:_id', function(req, res, next) {

    Client.findOne( { _id:  req.params._id})
        .then( (doc) => {
        if (doc) {
            res.render('client', { client: doc });

        } else {
            res.status(404);
    next(Error("Client not found"));
}
})
.catch( (err) => {
        next(err);
});
});

// POST to add new update for client
router.post('/addUpdate', function(req, res, next){

    // Push new date onto datesSeen array and then sort in date order.
    Client.findOneAndUpdate( {_id : req.body._id}, { $push : { datesSeen : { $each: [req.body.date], $sort: 1} } }, {runValidators : true})
        .then( (doc) => {
        if (doc) {
            res.redirect('/client/' + req.body._id);   // Redirect to this client's info page
        }
        else {
            res.status(404);  next(Error("Attempt to add update failed, client not in database"))
}
})
.catch( (err) => {

        console.log(err);

    if (err.name === 'CastError') {
        req.flash('error', 'Date must be in a valid date format');
        res.redirect('/client/' + req.body._id);
    }
    else if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        res.redirect('/client/' + req.body._id);
    }
    else {
        next(err);
    }
});
});


module.exports = router;