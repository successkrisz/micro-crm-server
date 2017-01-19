import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index';
import User from '../src/models/User';
import { login } from '../src/controllers/authenticationController';
import mongoose from 'mongoose';
import config from 'config';

const should = chai.should();

mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost);

chai.use(chaiHttp);

function mockCtx (body = {}) {
    return {
        body: '',
        header: '',
        params: {id: ''},
        request: {body: body},
        status: ''
    };
}

function authorizationHeader (token) {
    return `Bearer ${token}`;
}

function createValidUser (firstName = 'Kriszi') {
    const user = new User({
        email: `${firstName}.balla@gmail.com`,
        password: 'password',
        profile: { firstName: firstName, lastName: 'Balla' }
    });
    return user.save();
}

describe('Test API endpoints', () => {
    var server;
    var validToken;

    before(() => {
        server = app.listen();
    });

    beforeEach(async () => {
        await User.remove({});
        await createValidUser('Anonimous');
        let ctx = mockCtx({
            email: 'anonimous.balla@gmail.com',
            password: 'password'
        });
        await login(ctx);
        validToken = ctx.body.token;
    });

    it('/GET /api/users :  should return users when they exist', async () => {
        await createValidUser('Krisztian');
        await new Promise((resolve) => {
            chai.request(server)
      .get('/api/users')
      .set('Authorization', authorizationHeader(validToken))
      .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          res.body[0].should.have.property('email').eql('anonimous.balla@gmail.com');
          res.body[0].should.have.property('profile').eql({ firstName: 'Anonimous', lastName: 'Balla' });
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('createdAt');
          res.body[0].should.have.property('updatedAt');
          res.body[0].should.have.property('role').eql('member');
          res.body[1].should.have.property('email').eql('krisztian.balla@gmail.com');
          res.body[1].should.have.property('profile').eql({ firstName: 'Krisztian', lastName: 'Balla' });
          res.body[1].should.have.property('_id');
          res.body[1].should.have.property('createdAt');
          res.body[1].should.have.property('updatedAt');
          res.body[1].should.have.property('role').eql('member');
          resolve();
      });
        });
    });

    it('/POST /api/user : should create new user when email,password,first name and last name provided', async () => {
        const newUser = {
            email: 'kriszi.balla@gmail.com',
            password: 'password',
            profile: { firstName: 'Kriszi', lastName: 'Balla' }
        };
        await new Promise((resolve) => {
            chai.request(server)
      .post('/api/user')
      .set('Authorization', authorizationHeader(validToken))
      .send(newUser)
      .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('kriszi.balla@gmail.com');
          res.body.should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
          res.body.should.have.property('_id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('role').eql('member');
          resolve();
      });
        });
    });

    it('/POST /api/user : should return erroror when password not provided', async () => {
        const newUser = {
            email: 'kriszi.balla@gmail.com',
            firstName: 'Kriszi',
            lastName: 'Balla'
        };
        await new Promise((resolve) => {
            chai.request(server)
      .post('/api/user')
      .set('Authorization', authorizationHeader(validToken))
      .send(newUser)
      .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('password');
          res.body.password.should.have.property('message');
          res.body.password.message.should.eql('Password required!');
          resolve();
      });
        });
    });

    it('/GET /api/user : should return 404 when ID don\'t exist', async () => {
        await new Promise((resolve) => {
            chai.request(server)
      .get('/api/user/123456789')
      .set('Authorization', authorizationHeader(validToken))
      .end((error, res) => {
          res.should.have.status(404);
          resolve();
      });
        });
    });

    it('/GET /api/user : should return User when ID exist', async () => {
        const user = await createValidUser();
        await new Promise((resolve) => {
            chai.request(server)
      .get('/api/user/' + user._id)
      .set('Authorization', authorizationHeader(validToken))
      .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('kriszi.balla@gmail.com');
          res.body.should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
          res.body.should.have.property('_id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('role').eql('member');
          resolve();
      });
        });
    });

    it('/DELETE /api/user : should delete user when ID exist', async () => {
        const user = await createValidUser();
        await new Promise((resolve) => {
            chai.request(server)
      .delete('/api/user/' + user._id)
      .set('Authorization', authorizationHeader(validToken))
      .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('kriszi.balla@gmail.com');
          res.body.should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
          res.body.should.have.property('_id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('role').eql('member');
          resolve();
      });
        });
    });

    it('/DELETE /api/user : should return 404 when ID don\'t exist', async () => {
        await new Promise((resolve) => {
            chai.request(server)
      .delete('/api/user/123456789')
      .set('Authorization', authorizationHeader(validToken))
      .end((error, res) => {
          res.should.have.status(404);
          resolve();
      });
        });
    });

    it('/PUT /api/user : should return 404 when ID don\'t exist', async () => {
        const user = await createValidUser();
        await new Promise((resolve) => {
            chai.request(server)
      .put('/api/user')
      .set('Authorization', authorizationHeader(validToken))
      .send(Object.assign({}, user, { _id: '123456789' }))
      .end((error, res) => {
          res.should.have.status(404);
          resolve();
      });
        });
    });

    it('/PUT /api/user : should update user when ID exists', async () => {
        const user = await createValidUser();
        let newUser = Object.assign({}, user._doc);
        newUser.email = 'john.doe@yahoo.com';
        newUser.profile.firstName = 'John';
        newUser.profile.lastName = 'Doe';
        await new Promise((resolve) => {
            chai.request(server)
      .put('/api/user')
      .set('Authorization', authorizationHeader(validToken))
      .send(newUser)
      .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('john.doe@yahoo.com');
          res.body.should.have.property('profile').eql({ firstName: 'John', lastName: 'Doe' });
          res.body.should.have.property('_id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('role').eql('member');
          resolve();
      });
        });
    });
});
