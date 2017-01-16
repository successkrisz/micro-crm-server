import "babel-polyfill";
import koa from 'koa';
import mongooseConnect from './mongoose';
import middleware from 'koa-router';
import logger from 'koa-logger';
import parser from 'koa-bodyparser';
import config from 'config';
import routing from './routing';
import mongoose from 'mongoose';
// Set up mongoose connection
const options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};
mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost, options);
mongoose.connection.on('error', console.error);

// Applies all routes to the router.
const router = routing(middleware());
const app = new koa();

if (process.env.NODE_ENV != 'test') {
  app.use(logger());
  app.use(async function(ctx, next) {
    console.log(ctx);
    return await next();
  });
}
app
  .use(parser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = app.listen(config.PORT, () => console.log("Server running at: http://localhost:" + config.PORT));

export default server;
