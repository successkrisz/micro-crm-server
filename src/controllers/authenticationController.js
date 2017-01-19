import config from 'config';
import jwt from 'jsonwebtoken';

import User from '../models/User';

const jwtAlgorithmOptions = { algorithm: config.ALGORITHM };

export async function login (ctx) {
    try {
        const user = await User.findOne({ email: ctx.request.body.email });
        const match = user.comparePasswordSync(ctx.request.body.password);

        if (!match) {
            ctx.body = { error: 'You\'ve provided a wrong email address or password. Please try again!' };
            return;
        }
        ctx.body = { token: generateToken(user) };
        return;
    } catch (error) {
        ctx.body = error;
    }
}

export function roleAuthorization (role = 'member') {
    return async function (ctx, next) {
        if (!headerHasToken(ctx.header)) {
            ctx.status = 401;
            return;
        }
        try {
            const token = extractToken(ctx);
            const user = verifyToken(token);
            const userInDB = await User.findOne({ email: user.data.email });

            if (userInDB.role === 'owner') {
                return await next();
            }
            if (userInDB.role === 'admin' && role !== 'owner') {
                return await next();
            }
            if (userInDB.role !== role) {
                ctx.status = 403;
                return;
            }

            return await next();
        } catch (error) {
            ctx.status = 401;
        }
    };
}

function generateToken (user) {
    return jwt.sign(createJwtPayload(user), config.SECRET, jwtAlgorithmOptions);
}

function headerHasToken (header) {
    return (header.authorization && header.authorization.split(' ')[0] === 'Bearer');
}

function createJwtPayload (user) {
    return {
        exp: Math.floor(Date.now() / 1000) + 3600,
        data: { email: user.email, role: user.role }
    };
}

function extractToken (ctx) {
    return ctx.header.authorization.split(' ')[1];
}

function verifyToken (token) {
    return jwt.verify(token, config.SECRET, jwtAlgorithmOptions);
}
