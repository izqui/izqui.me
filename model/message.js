var mongoose = require('mongoose')

var messS = new mongoose.Schema({

	date: Date, 

	text: String
})

messS.statics.create = function (text, cb){

	var mes = new this()

	mes.date = Date.now()
	mes.text = text

	mes.save(cb)
}
module.exports = exports = messS