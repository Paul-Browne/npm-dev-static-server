const server = require(".");

var x = server({
	port: 8000,
	directory: "test"
});

setTimeout(() => {
    x.close();
}, 5000)

