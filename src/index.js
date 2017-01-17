import "babel-polyfill";
import config from 'config';
import _debug from 'debug';
import koa from 'koa';
import convert from 'koa-convert';
import parser from 'koa-bodyparser';
import logger from 'koa-logger';

import connectToDB from './mongoose';
import router from './routing';

const debug = _debug('app:server');
const notTest = (process.env.NODE_ENV != 'test');

async function contextLogger(ctx, next) {
  debug(ctx);
  return await next();
}

const app = new koa();

if (notTest) app.use(convert(logger()));
if (config.LOGGING_CONTEXT) app.use(contextLogger);

app
  .use(convert(parser()))
  .use(router.routes())
  .use(router.allowedMethods())

if (notTest) {
  app.listen(config.PORT, () => debug("Server running at: http://localhost:" + config.PORT));
}
