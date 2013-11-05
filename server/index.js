var express = require('express'),
	path = require('path')

var api = require('./api'),
	middleware = require('./middleware')

var app = express()

//App config
//app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride())
app.use('/static',express.static(path.join(__dirname, '..', 'public')));
app.use('/api', express.static(path.join(__dirname, '..', 'content')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')))
app.use(express.favicon(path.join(__dirname, '..', 'public', 'fav.ico')))

app.use(app.router);


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Routes


app.get('/', middleware.phone, api.root)
app.get('/api', api.api)
app.get('/api/languages', middleware.json, api.languages)
app.get('/api/images', middleware.json, api.images)
app.get('/r', api.redirecter)
app.get('/redirectees', api.redirectees)

app.get('/:lang',middleware.phone, api.root)

//Messaging
app.post('/api/message', middleware.json, api.sendMessage)



module.exports = exports = app