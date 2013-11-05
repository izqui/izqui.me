var mongoose = require('mongoose')

var redirS = new mongoose.Schema({

	date: Date, 

	ip: String, 
	useragent: String,
	
	redirect: String
})

redirS.statics.create = function (redirect, ip, useragent, cb){

	var r = new this()
	r.date = Date.now()
	r.ip = ip
	r.redirect = redirect
	r.useragent = useragent
	r.save(cb)
}

module.exports = exports = redirS