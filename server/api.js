var fs = require('fs'),
	path = require('path')

exports.root = function (req, res){

	var lang = 'en'
	
	fs.readFile(path.join(__dirname,'..', 'content', lang+'.json'), function (err, f){

		if (err) res.send(500)
		else {

			var json = JSON.parse(f.toString())
			var pretty = JSON.stringify(json, null, 4)
			console.log(pretty)
			res.render('index', {json:json})
		}	
	})
	
}

