const tscl = require('time-stamped-console-log');
const serveStatic = require('serve-static');
const compression = require('compression');
//const tryPorts = require('try-ports');
const express = require('express');
const http2 = require('spdy');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const serverSetup = (protocal, port, directory, sslKeyPath, sslCrtPath) => {
    const app = express();
    app.use(compression())
    app.use(serveStatic(directory, {
        'extensions': ['html'],
        'maxAge': 3600000   // 1 hour
    }))
    tscl("serving: " + directory + "/ at " + protocal + "://localhost:" + port, {
        message: {
            color: "magenta"
        }
    })
    if (protocal === "https") {
        return http2.createServer({
            key: fs.readFileSync(path.join(os.homedir(), sslKeyPath), 'utf8'),
            cert: fs.readFileSync(path.join(os.homedir(), sslCrtPath), 'utf8')
        }, app).listen(port);
    } else {
        return http.createServer(app).listen(port);
    }
}

const startServer = (port, directory, sslKeyPath, sslCrtPath) => {
    const keyBoolean = fs.existsSync(path.join(os.homedir(), sslKeyPath));
    const crtBoolean = fs.existsSync(path.join(os.homedir(), sslCrtPath));
    if(keyBoolean && crtBoolean){
        return serverSetup("https", port, directory, sslKeyPath, sslCrtPath);
    }else{
        return serverSetup("http", port, directory);
    }
}

module.exports = opts => {
    const port = opts.port || 8888;
    const directory = opts.directory || 'public';
    const sslKeyPath = opts.key || '.ssl/localhost.key';
    const sslCrtPath = opts.cert || '.ssl/localhost.crt';
    //tryPorts(opts.port, _port => {
    return startServer(port, directory, sslKeyPath, sslCrtPath);
    //})
}