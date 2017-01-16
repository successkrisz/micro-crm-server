/**
 * Authentication controller
 *
 * on login returns a json web token
 *
 * on authorization verify the token
 *
 */
 import User from '../models/User';
 import jwt from 'jsonwebtoken';
 import config from 'config';

 export async function login(ctx, next) {
   try {
     const user = await User.findOne({email: ctx.request.body.email});
     const match = user.comparePasswordSync(ctx.request.body.password);
     if (match) {
       ctx.body = {
         token: jwt.sign({
           exp: Math.floor(Date.now()/1000) + 3600,
           data: {
             email: user.email,
             role: user.role
           }
          }, config.SECRET, { algorithm: 'HS256'}),
          message: 'Login was successfull'
       };
     } else {
       ctx.body = {error: 'You\'ve provided a wrong email address or password. Please try again'};
     }
   } catch(e) {
     // TODO only supply a few details in error message
     ctx.body = e;
   }
 }

// verify if user is allowed to access content (always checking)
 export function roleAuthorization(role = 'Member') {
   return async function (ctx, next) {
     ctx.status = 401;
     ctx.body = {redirect: 'login'};
     if (ctx.header.authorization && ctx.header.authorization.split(' ')[0] === 'Bearer') {
       try {
         const token = ctx.header.authorization.split(' ')[0];
         const user = jwt.verify(token, config.SECRET, {algorithms: ['HS256']});
         const userInDB = await User.findOne({email: user.data.email});
         if (userInDB.role === role) {
           return await next();
         }
       } catch(e) {}
     }
   }
 }
