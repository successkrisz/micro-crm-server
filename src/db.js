import mongoose from 'mongoose';
import _debug from 'debug';

const debug = _debug('app:db');

export default function (config) {
    return new Promise((resolve, reject) => {
        if (mongoose.connection.readyState) { resolve(); }

        const keepAlive = (config.DBKeepAlive) ? 1 : 0;
        const options = {
            server: {
                socketOptions: {
                    keepAlive: keepAlive,
                    connectTimeoutMS: config.DBConnectTimeoutMS
                }
            },
            replset: {
                socketOptions: {
                    keepAlive: keepAlive,
                    connectTimeoutMS : config.DBConnectTimeoutMS
                }
            }
        };

        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', (err) => {
            if (err) { reject(err); }
            debug('Mongoose connection open to ' + config.DBHost);
            resolve();
        });

        mongoose.connection.on('error', (e) => {
            debug('Mongoose connection error: ' + e);
        });

        mongoose.connection.on('disconnected', () => {
            debug('Mongoose connection disconnected');
        });

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                debug('Mongoose connection disconnected through app termination');
                process.exit(0);
            });
        });

        mongoose.connect(config.DBHost, options);
    });
}
