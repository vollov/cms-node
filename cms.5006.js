var http = require('http');
var express = require('express')
	, midware = require('./lib/midware');
var port = parseInt(process.env.PORT,10) || 5006;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var Config = require('./lib/config');
var config = Config().getProdConfig();

app.config = config;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/app/')));

app.all('/*', midware.header);
//app.all('/api/*', midware.validateRequest);

//API
require('./api/login')(app);
require('./api/page')(app);
require('./api/crud')(app);
//require('./api/order')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

http.createServer(app).listen(port, function(){
	console.log('Now serving the app at localhost:' + port);
});
//module.exports = app;
