import { join } from 'path';
import { homedir } from 'os';
import { readFile, access } from 'fs/promises';
import express from 'express';
import compression from 'compression';
import { createServer } from 'http';
import tscl from 'time-stamped-console-log';
import serveStatic from 'serve-static';
import spdy from 'spdy';
import cors from 'cors';


const serverSetup = async (protocal, port, directory, corsAllowed, sslKeyPath, sslCrtPath) => {
    const app = express();
    app.use(compression())
    if(corsAllowed){
        app.use(cors());
    }
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
        return spdy.createServer({
            key: await readFile(join(homedir(), sslKeyPath), 'utf8'),
            cert: await readFile(join(homedir(), sslCrtPath), 'utf8')
        }, app).listen(port);
    } else {
        return createServer(app).listen(port);
    }
}

const startServer = async (port, directory, corsAllowed, sslKeyPath, sslCrtPath) => {
    try {
        const keyBoolean = await access(join(homedir(), sslKeyPath));
        const crtBoolean = await access(join(homedir(), sslCrtPath));        
        return serverSetup("https", port, directory, corsAllowed, sslKeyPath, sslCrtPath);
    } catch (error) {
        return serverSetup("http", port, directory, corsAllowed);   
    }
}

export default opts => {
    const port = opts.port || 8888;
    const directory = opts.directory || 'public';
    const sslKeyPath = opts.key || '.ssl/localhost.key.pem';
    const sslCrtPath = opts.cert || '.ssl/localhost.crt.pem';
    const corsAllowed = opts.cors || true;
    return startServer(port, directory, corsAllowed, sslKeyPath, sslCrtPath);
}