var fs = require('fs'),
	path = require('path'),
	jsonP = require('../helpers/json'),
	config = require('../config'),
	mongoose = require('mongoose'),
	notifs = require('../helpers/notifs'),
	passbook = require('passbook')


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

			fs.readdir(path.join(__dirname, '..', 'img'), function (err, files){

				var json = JSON.parse(f.toString())

				//Images
				json.images = {}	
				for (var i in files){

					var file = files[i]
					var name = file.slice(0, file.indexOf('.'))
					json.images[name] = ((process.env.NODE_ENV == 'production') ? config.base:'http://localhost:8080/')+'img/'+file
				}

				var pretty = JSON.stringify(json, null, 2)
				res.render('index', {json:json, pretty:jsonP.prettify(pretty), image:config.image, lang:lang})
			})
		}	
	})
}

exports.passbook = function (req, res) {

	var template = passbook("generic", {
		passTypeIdentifier: "pass.me.yzl.coupon",
		teamIdentifier: "72RF4L6QZW",
		organizationName: "Jorge Izquierdo",
		backgroundColor: "rgb(90,177,166)",
		foregroundColor: "rgb(255,255,255)",
		labelColor: "rgb(255,255,255)",
		relavantDate: new Date(Date.now() + 1000*3600*24).toString()
	})
	template.keys(path.join(__dirname, "keys"), "hola")
	template.loadImagesFrom(path.join(__dirname, "images"))

	var pass = template.createPass({
		serialNumber: "123",
		description:"Hey there",
		suppressStripShine: true,
		barcode: {format: "PKBarcodeFormatPDF417", message:"http:/izqui.me/card", messageEncoding: "iso-8859-1"}
	})

	pass.headerFields.add("name", "", "Business card")
	pass.primaryFields.add("name", "", "Jorge Izquierdo", {textAlignment: "PKTextAlignmentLeft"})
	pass.secondaryFields.add("email", "EMAIL", "jorge@izqui.me", {textAlignment: "PKTextAlignmentLeft"})
	pass.secondaryFields.add("phone", "PHONE", "+34 628 151 894", {textAlignment: "PKTextAlignmentRight"})
	pass.auxiliaryFields.add("twitter", "TWITTER", "@izqui9", {textAlignment: "PKTextAlignmentLeft"})
	pass.auxiliaryFields.add("web", "WEBSITE", "http://izqui.me", {textAlignment: "PKTextAlignmentRight"})
	pass.backFields.add("phone", "Mobile phone", "+34 628 151 894")
	pass.backFields.add("cv", "Curriculum vitae", "http://izqui.me/files/cv.pdf")
	
	pass.render(res, function (err){
		if (err){
			console.log(err)
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

	fs.readdir(path.join(__dirname, '..', 'img'), function (err, files){

		var json = {images:{}}
		for (var i in files){

			var file = files[i]
			var name = file.slice(0, file.indexOf('.'))
			json.images[name] = ((process.env.NODE_ENV == 'prod') ? config.base:'http://localhost:3000/')+'img/'+file
		}

		res.send(json)

	})
}

exports.file = function(req, res){

	var p = req.params.path	
	
	var text = "File: "+p

	notifs.send(text)

	res.sendfile(path.join(__dirname, '..', 'files', p))
}

exports.magicremote = function(req, res){

	var base = config.magicremote

	if (req.params[0]) base += '/'+req.params[0]

	res.redirect(base)
}
exports.taylor = function(req, res){

        res.redirect("http://github.com/izqui/taylor")
}

exports.pass = function(req, res){

	var p = req.params.path	
	
	var text = "File: "+p

	notifs.send(text)

	res.headers["Content-type"] = "application/vnd.apple.pkpass"
	res.sendfile(path.join(__dirname, '..', 'passes', p))
}

