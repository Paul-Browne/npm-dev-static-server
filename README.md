# static-server-dev
A simple express server with https, http2, compression and serve-static

### usage

`npm i static-server-dev`

or 

`npm i -D static-server-dev`


```js
import devServer from "static-server-dev";

devServer();
```

Thats it... just go to [localhost:8888](localhost:8888) You can also pass options and instantiate the server, so you can, for example close it later from the main thread.

```js
import devServer from "static-server-dev";

// options, with defaults shown
const server = devServer({
	port: 8888,
	directory: "public",
	cors: true,                 // allow CORS default true
	key: ".ssl/localhost.key",  // path to your local
	cert: ".ssl/localhost.crt"  // certs and keys to enable https
});

const closeTheServer = () => {
	server.close();
}
```

### TODO

1. Usd try-ports to dynamically set the port if passed port is taken
2. use nodes built in http2 module to replace spdy