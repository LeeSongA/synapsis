var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login')
var registerRouter = require('./routes/register')
var scoreRouter = require('./routes/score')
var rankingRouter = require('./routes/ranking');
var postingRouter = require('./routes/posting');
var personRouter = require('./routes/person');
var getMatchRouter = require('./routes/getMatch');
const config = require('./config');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('jwt-secret', config.secret)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register',registerRouter)
app.use('/score',scoreRouter)
app.use('/ranking', rankingRouter);
app.use('/posting', postingRouter);
app.use('/person',personRouter);
app.use('/getMatch',getMatchRouter);


// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
   // CONNECTED TO MONGODB SERVER
   console.log("Connected to mongod server");
});


mongoose.connect(config.mongodbUri,{ useNewUrlParser: true })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 next(createError(404));
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

