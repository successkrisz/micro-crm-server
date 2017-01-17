import config from 'config';
import jwt from 'jsonwebtoken';

import User from '../models/User';

export function generateToken(user) {
  return jwt.sign({
    exp: Math.floor(Date.now()/1000) + 3600,
    data: {
      email: user.email,
      role: user.role
    }
  }, config.SECRET, { algorithm: config.ALGORITHM});
}

function verifyToken(token) {
  return jwt.verify(token, config.SECRET, {algorithms: config.ALGORITHM});
}

export async function login(ctx) {
  try {
    const user = await User.findOne({email: ctx.request.body.email});
    const match = user.comparePasswordSync(ctx.request.body.password);
    if (!match) return ctx.body = {error: 'You\'ve provided a wrong email address or password. Please try again!'};
    ctx.body = { token: generateToken(user) };
  } catch(e) {
    ctx.body = e;
  }
}

export function roleAuthorization(role = 'Member') {
  return async function (ctx, next) {
    if (!ctx.header.authorization || ctx.header.authorization.split(' ')[0] != 'Bearer') {
      return ctx.status = 401;
    }
    try {
      const token = ctx.header.authorization.split(' ')[1];
      const user = verifyToken(token);
      const userInDB = await User.findOne({email: user.data.email});
      if (userInDB.role === 'Owner') return await next();
      if (userInDB.role === 'Admin' && role !== 'Owner') return await next();
      if (userInDB.role !== role) return ctx.status = 403;
      return await next();
    } catch(e) {
      ctx.status = 401;
    }
  };
}
