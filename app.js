var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);

var index = require('./routes/index')
var users = require('./routes/users');

// Set the environment variable MONGO_URL, mine is using mlab db
var db_url = process.env.MONGO_URL; //  "mongodb://dbUser:password23@ds123956.mlab.com:23956/healthapp";

// And connect to mongoose, log success or error
mongoose.Promise = global.Promise;  // use native ES6 promises
mongoose.connect(db_url, { useMongoClient: true })
    .then( () => {  console.log('Connected to MongoDB') } )
    .catch( (err) => { console.log('Error Connecting to MongoDB', err); });

// Require routes files
var tasks = require('./routes/tasks');
var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure passport and session store
var store = MongoDBStore( { uri: db_url, collection : 'healthapp_sessions'} );

var mongo_pw = process.env.MONGO_PW;
var url = process.env.MONGO_URL; //  'mongodb://dbUser:password23@ds123956.mlab.com:23956/healthapp';
var session_url =process.env.MONGO_URL; //  'mongodb://dbUser:password23@ds123956.mlab.com:23956/healthapp';

// Configure flash messaging. Do this after cookieParser
app.use(session({
    secret: 'replace me with long random string',
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore( { uri: session_url })
}));


require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());         // This creates an req.user variable for logged in users.
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(url);

app.use('/auth', auth);   // Order matters! Login page
app.use('/users', users);        // Get user records
app.use('/tasks', tasks);        // Tasklists
app.use('/', index);        // For trainer to manage clients

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
