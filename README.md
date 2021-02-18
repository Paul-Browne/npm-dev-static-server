# static-server-dev
A simple express server with https, http2, compression and serve-static

### usage

`npm i static-server-dev`

or 

`npm i -D static-server-dev`


```js
const devServer = require("static-server-dev");

devServer();
```

Thats it... You can also pass options and instantiate the server, so you can, for example close it later from the main thread.

```js
const devServer = require("static-server-dev");

// options, with defauls shown
const server = devServer({
	port: 8888,
	directory: "public",
	key: ".ssl/localhost.key",		// path to your local
	cert: ".ssl/localhost.krt"		// certs and keys to enable https
});

const closeTheServer = () => {
	server.close();
}
```

### TODO

1. Usd try-ports to dynamically set the port if passed port is taken
2. use nodes built in http2 module to replace spdy