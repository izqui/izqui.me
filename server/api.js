var fs = require('fs'),
	path = require('path'),
	jsonP = require('../helpers/json'),
	config = require('../config')

var apn = require('apn')

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

		var options = { "gateway": "gateway.sandbox.push.apple.com", "cert":path.join(__dirname, '..', 'certs/cert.pem'), "key":path.join(__dirname, '..', 'certs/key.pem')};
		var token  = 'e4410fd56a2d1246f4b810217f26ff4080f4f4fbf76917a3a2c7766bdc309c50';

		var connection = new apn.Connection(options);
		var device = new apn.Device(token)

		var not = new apn.Notification();
		not.expiry = Math.floor(Date.now() / 1000) + 3600*8;
		not.badge = 1;
		not.alert = text;

		connection.pushNotification(not, device);

		res.send(200, JSON.stringify({'status':'sent'}))
	}

	else {

		res.send(400, JSON.stringify({'error':'no text'}))
	}

	connection.pushNotification(not, device);
}
