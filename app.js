//Port and env
var env = process.argv[2] || 'dev';
process.env.NODE_ENV = ((env == 'prod') ? 'production' : 'development');

//Database setup
var mongoose = require('mongoose'),
	model = require('./model')

mongoose.connect('mongodb://localhost/izquidb')
mongoose.model('Redirect', model.redirect)
mongoose.model('Message', model.message)


//Server boot
var PORT = (process.env.NODE_ENV == 'production') ? 80 : 8080
require('./server').listen(PORT, function(){
  console.log('Express server listening on port ' + PORT+' env: '+process.env.NODE_ENV);
});