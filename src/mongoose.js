import mongoose from 'mongoose';
import config from 'config';
// Set up mongoose connection
export default function mongooseConnect() {
  const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
  };
  mongoose.Promise = global.Promise;
  mongoose.connect(config.DBHost, options);
  mongoose.connection.on('error', console.error);
}
