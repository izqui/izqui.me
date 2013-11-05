var fs = require('fs'),
	path = require('path'),
	jsonP = require('../helpers/json'),
	config = require('../config'),
	mongoose = require('mongoose'),
	notifs = require('../helpers/notifs')

var Redirect = mongoose.model('Redirect'),
	Message = mongoose.model('Message')

exports.root = function (req, res){

	var lang = ""

	//Check if lang file exists before reading the file
	if (req.params.lang && fs.existsSync(path.join(__dirname, '..', 'content', req.params.lang+'.json'))){
		
		lang = req.params.lang
	}
	else lang = config.defaultLang
	
	fs.readFile(path.join(__dirname,'..', 'content', lang+'.json'), function (err, f){

		if (err) res.send(500)
		else {

			fs.readdir(path.join(__dirname, '..', 'images'), function (err, files){

				var json = JSON.parse(f.toString())

				//Images
				json.images = {}	
				for (var i in files){

					var file = files[i]
					var name = file.slice(0, file.indexOf('.'))
					json.images[name] = ((process.env.NODE_ENV == 'production') ? config.base:'http://localhost:3000/')+'images/'+file
				}

				var pretty = JSON.stringify(json, null, 2)
				res.render('index', {json:json, pretty:jsonP.prettify(pretty), image:config.image})
			})
		}	
	})
}

exports.api = function (req, res){

	res.sendfile(path.join(__dirname, '..', 'content', 'api.txt'))
}

exports.languages = function (req, res){

	fs.readdir(path.join(__dirname, '..', 'content'), function (err, files){

		var langs = {langs:[]}
		for (var i in files){

			var file = files[i]
			if (file.indexOf('.json') !== -1){

				langs.langs.push(file.replace('.json', ''))
			}
		}
		res.send(JSON.stringify(langs, null, 4))
	})	
}

exports.images = function (req, res){

	fs.readdir(path.join(__dirname, '..', 'images'), function (err, files){

		var json = {images:{}}
		for (var i in files){

			var file = files[i]
			var name = file.slice(0, file.indexOf('.'))
			json.images[name] = ((process.env.NODE_ENV == 'prod') ? config.base:'http://localhost:3000/')+'images/'+file
		}

		res.send(json)

	})
}

exports.sendMessage = function (req, res){

	var text = req.body.text;

	if (text){

		notifs.send(text);
		Message.create(text, function (err){

			if (err) res.send(500)
			else res.send(200, JSON.stringify({'status':'sent'}))
		})
		
	}

	else {

		res.send(400, JSON.stringify({'error':'no text'}))
	}
}

exports.getMessages = function (req, res){

	Message.find({}).limit(40).select('date text').sort('-date').exec(function (err, ms){

		res.send(ms)
	})
}

exports.redirecter = function (req, res){

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	var ua = req.headers['user-agent']
	var red = config.redirects[parseInt(req.query.r)] || config.redirects[0]

	Redirect.create(red, ip, ua, function (err){

		res.redirect(red)
		notifs.send('Visit from '+ip+' to '+red)
	})
	
}

exports.redirectees = function (req, res){

	Redirect.find({}).select('-_id').sort('date').exec(function (err, rs){

		res.render('redirectees', {json:{name:'Red'}, rs:rs})
	})

}