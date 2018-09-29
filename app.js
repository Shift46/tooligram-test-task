const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const instagramRouter = require('./routes/instagram');

let app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/instagram', instagramRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;