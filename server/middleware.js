var config = require('../config')


exports.json = function(req, res, next){

	res.set('Content-type', 'application/json')
	next()
}
exports.phone = function(req, res, next){

	res.set('Phone', 'KzM0NjI4MTUxODk0')
	next()
}

exports.messagesKeyRequired = function (req, res, next){

	var key = req.get(config.messagekey_header)

	if (key && key == require('../certs/key').key){

		next()
	}
	else {

		res.send(403, {'error':'key'})
	}
}
