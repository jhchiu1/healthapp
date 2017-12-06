var express = require('express');
var router = express.Router();
var User = require('../models/user');


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

//router.use(isLoggedIn);


/* Since this file is mounted at /client this route is actually accessible at /client/
*/
router.get('/:id', function(req, res, next){
      res.redirect('/users/' + req.user._id);

      // Retrieve specific user record
       User.findById(id, function(err, doc){
           if (err) { next(err); }
           else
           {
               res.render('client', { user : doc })
           }
       });
  });
  


module.exports = router;
