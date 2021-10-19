import server from "./index.js";

await server({
	port: 8001,
	directory: "test1"
});
