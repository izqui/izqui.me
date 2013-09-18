//Port and env
var env = process.argv[2] || 'dev';
process.env.NODE_ENV = ((env == 'prod') ? 'production' : 'development');

var PORT = (process.env.NODE_ENV == 'production') ? 80 : 3000

require('./server').listen(PORT, function(){
  console.log('Express server listening on port ' + PORT+' env: '+process.env.NODE_ENV);
});
