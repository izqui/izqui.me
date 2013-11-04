izqui.me
========

A nodeJS powered JSON Portfolio/CV. Example: [izqui.me](http://izqui.me)

## Motivation

While flying home with my friend [Luis](http://github.com/luisivan) from London (after Campus Party Europe) we had an argument with some passangers on the plane that Luis explains further [here](https://github.com/luisivan/fakematrix#the-story)

They called us "niñatos" and laugh at us, so we decided to build something from the ground up on the plane to prove we are not. Luis build [this](https://github.com/luisivan/fakematrix) in order to scare them and I decided to build myself a website due that I don't update my blog frequently.

## How does it work

Content shown in the website is stored in the `content/` directory. 

```
content/
	en.json
	es.json
	...
	api.txt
```

Each of the `.json` files are the translation the web will have and the `api.txt` file, the API documentation.

In addition, images are stored in the `images/` directory.

## Setup 

To install it in your own server, you only need to copy the source from Github, install dependencies and change the content files

```
git clone https://github.com/izqui/izqui.me.git example.com
cd example.com
npm install

//Edit config
nano config.json

//Edit files
cd content/

npm start
```

## API

The website also has a very simple REST API to get data.

	*Get content of language: `GET /api/[lang].json E.g.: http://izqui.me/api/en.json`
	*Images: `GET /api/images E.g.: http://izqui.me/api/images`
	*Language list: `GET /api/languages E.g: http://izqui.me/api/languages`


It works with APNS (Apple push notification service) to send my iPhone a push notification with the text.

	*PUSH /api/message (The text in the notification is the text property in the http body)
