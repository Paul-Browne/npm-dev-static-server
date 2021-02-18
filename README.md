# dev-static-server
A simple express server with https, http2, compression and serve-static

### usage

`npm i dev-static-server`

or 

`npm i -D dev-static-server`


```js
const devServer = require("dev-static-server");

devServer();
```

Thats it... You can also pass options and instantiate the server, so you can, for example close it later from the main thread.

```js
const devServer = require("dev-static-server");

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