import { expect } from 'chai';
import User from '../../src/models/User';
import {
  login,
  roleAuthorization
  } from '../../src/controllers/authenticationController';

const isToken = /^\S*\.\S*\.\S*$/;

function mockCtx(body = {}){
    return {
        body: '',
        header: '',
        params: {id: ''},
        request: {body: body},
        status: '',
    };
}

function createValidUser(firstName = 'Kriszi') {
    const user = new User({
        email: `${firstName}.balla@gmail.com`,
        password: 'password',
        profile: { firstName: firstName, lastName: 'Balla' }
    });
    return user.save();
}

describe('testing authenticationController', () => {
    var validToken;

    beforeEach(async () => {
        await User.remove({});
        await createValidUser();

        let ctx = mockCtx({
            email: 'kriszi.balla@gmail.com',
            password: 'password'
        });
        await login(ctx);
        validToken = ctx.body.token;
    });

    it('login should return token when when email and password match', async () => {
        let ctx = mockCtx({
            email: 'kriszi.balla@gmail.com',
            password: 'password'
        });
        await login(ctx);
        expect(ctx.body).to.have.property('token');
        const matchingPattern = isToken.test(ctx.body.token);
        expect(matchingPattern).to.equal(true);
    });

    it('login should return error when when email and password don\'t match', async () => {
        let ctx = mockCtx({
            email: 'kriszi.balla@gmail.com',
            password: 'wrongPass'
        });
        await login(ctx);
        expect(ctx.body).to.have.property('error');
        expect(ctx.body.error).to.equal('You\'ve provided a wrong email address or password. Please try again!');
    });

    it('roleAuthorization should return 401 if there\'s no token', async () => {
        let ctx = mockCtx();
        await roleAuthorization()(ctx);
        expect(ctx.status).to.equal(401);
    });

    it('roleAuthorization should return 403 when role is not sufficient', async () => {
        let ctx = mockCtx();
        const user = {
            email: 'kriszi.balla@gmail.com',
            role: 'member'
        };
        //const jwt = generateToken(user);
        ctx.header = { authorization: `Bearer ${validToken}` };
        await roleAuthorization('admin')(ctx);
        expect(ctx.status).to.equal(403);
    });

    it('roleAuthorization should call next() when role is sufficient', async () => {
        let ctx = mockCtx();
        const user = {
            email: 'kriszi.balla@gmail.com',
            role: 'member'
        };
        //const jwt = generateToken(user);
        console.log(validToken);
        ctx.header = { authorization: `Bearer ${validToken}` };
        const mockNext = () => { ctx.status = 200; };
        await roleAuthorization()(ctx, mockNext);
        expect(ctx.status).to.equal(200);
    });
});
