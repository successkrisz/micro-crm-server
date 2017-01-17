import mongoose from 'mongoose';
import config from 'config';
import _debug from 'debug';

const debug = _debug('app:db');

export default function () {
  if (mongoose.connection.readyState) return;
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
  mongoose.connect(config.DBHost, options);

  mongoose.connection.on('connected', () => {
    debug('Mongoose connection open to ' + config.DBHost);
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
}
