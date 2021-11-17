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


const serverSetup = async (protocal, port, directory, corsAllowed, cache, sslKeyPath, sslCrtPath) => {
    const app = express();
    app.use(compression())
    if(corsAllowed){
        app.use(cors());
    }
    app.use(serveStatic(directory, {
        'extensions': ['html'],
        'maxAge': cache
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

const startServer = async (port, directory, corsAllowed, cache, sslKeyPath, sslCrtPath) => {
    try {
        const keyBoolean = await access(join(homedir(), sslKeyPath));
        const crtBoolean = await access(join(homedir(), sslCrtPath));        
        return serverSetup("https", port, directory, corsAllowed, cache, sslKeyPath, sslCrtPath);
    } catch (error) {
        return serverSetup("http", port, directory, corsAllowed, cache);   
    }
}

export default async (opts = {
    port: 8888,
    directory: 'public',
    key: '.ssl/localhost.key.pem',
    cert: '.ssl/localhost.crt.pem',
    cors: true,
    cache: 3600000  // 1 hour
}) => {
    return await startServer(opts.port, opts.directory, opts.cors, opts.cache, opts.key, opts.cert);
}