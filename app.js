//Port and env
var env = process.argv[2] || 'prod';
var PORT = process.env.PORT || 3000
process.env.NODE_ENV = ((env == 'prod') ? 'production' : 'development');

require('./server').listen(PORT, function(){
  console.log('Express server listening on port ' + PORT);
});
