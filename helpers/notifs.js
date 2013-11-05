var apn = require('apn'),
	path = require('path')

var options = { "gateway": "gateway.sandbox.push.apple.com", "cert":path.join(__dirname, '..', 'certs/cert.pem'), "key":path.join(__dirname, '..', 'certs/key.pem')};
var token  = 'e4410fd56a2d1246f4b810217f26ff4080f4f4fbf76917a3a2c7766bdc309c50';

var connection = new apn.Connection(options);
var device = new apn.Device(token)

exports.send = function(text){

	var not = new apn.Notification();
	not.expiry = Math.floor(Date.now() / 1000) + 3600*8;
	not.badge = 1;
	not.alert = text;

	connection.pushNotification(not, device);
}