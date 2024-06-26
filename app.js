var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// routers modules
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var galleriesRouter = require('./routes/galleries');
var imagesRouter = require('./routes/images');
var statsRouter = require('./routes/stats');

var app = express();

// set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb://localhost:27017/GalleryDB";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.use('/galleries', express.static(path.join(__dirname, 'public/images')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Przykład własnego middleware.
// app.use((req, res, next) => {
  // console.log('Own middleware');
  // next();
// })

// routes paths
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/galleries', galleriesRouter);
app.use('/images', imagesRouter);
app.use('/stats', statsRouter);

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
