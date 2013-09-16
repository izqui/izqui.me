exports.json = function(req, res, next){

	res.set('Content-type', 'application/json')
	next()
}
exports.phone = function(req, res, next){

	res.set('Phone', 'KzM0NjI4MTUxODk0')
	next()
}