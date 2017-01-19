import 'babel-polyfill';
import _debug from 'debug';
import Koa from 'koa';
import convert from 'koa-convert';
import parser from 'koa-bodyparser';
import logger from 'koa-logger';
import router from './routing';

const debug = _debug('app:server');
const isTestEnv = (process.env.NODE_ENV === 'test');

async function contextLogger (ctx, next) {
    debug(ctx);
    return await next();
}

const app = new Koa();

if (!isTestEnv) { app.use(convert(logger())); }
if (!isTestEnv) { app.use(contextLogger); }

app
  .use(convert(parser()))
  .use(router.routes())
  .use(router.allowedMethods());

export default app;
