import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import User from '../src/models/User';
import { generateToken } from '../src/controllers/authenticationController';
import mongoose from 'mongoose';
import config from 'config';

const should = chai.should();

mongoose.connect(config.DBHost);

chai.use(chaiHttp);

function authorizationHeader(user) {
    return 'Bearer ' + generateToken(user);
}

function createValidUser(firstName = 'Kriszi') {
    const user = new User({
        email: `${firstName}.balla@gmail.com`,
        password: 'password',
        profile: { firstName: firstName, lastName: 'Balla' }
    });
    user.save();
    return user;
}

describe('Test API endpoints', () => {
    let server;

    before(() => {
        server = app.listen();
    });

    beforeEach((done) => {
        User.remove({}, () => {
            done();
        });
    });

    after(() => {
        mongoose.connection.close();
    });

    it('/GET /api/users :  should return users when they exist', async () => {
        const user = await createValidUser();
        await createValidUser('Krisztian');
        await new Promise((resolve) => {
            chai.request(server)
      .get('/api/users')
      .set('Authorization', authorizationHeader(user))
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          res.body[0].should.have.property('email').eql('kriszi.balla@gmail.com');
          res.body[0].should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
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
        const user = await createValidUser('Krisztian');
        await new Promise((resolve) => {
            chai.request(server)
      .post('/api/user')
      .set('Authorization', authorizationHeader(user))
      .send(newUser)
      .end((err,res) => {
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

    it('/POST /api/user : should return error when password not provided', async () => {
        const newUser = {
            email: 'kriszi.balla@gmail.com',
            firstName: 'Kriszi',
            lastName: 'Balla'
        };
        const user = await createValidUser('Krisztian');
        await new Promise((resolve) => {
            chai.request(server)
      .post('/api/user')
      .set('Authorization', authorizationHeader(user))
      .send(newUser)
      .end((err,res) => {
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
        const user = await createValidUser();
        await new Promise((resolve) => {
            chai.request(server)
      .get('/api/user/123456789')
      .set('Authorization', authorizationHeader(user))
      .end((err,res) => {
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
      .set('Authorization', authorizationHeader(user))
      .end((err,res) => {
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
      .set('Authorization', authorizationHeader(user))
      .end((err,res) => {
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
        const user = await createValidUser();
        await new Promise((resolve) => {
            chai.request(server)
      .delete('/api/user/123456789')
      .set('Authorization', authorizationHeader(user))
      .end((err,res) => {
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
      .set('Authorization', authorizationHeader(user))
      .send(Object.assign({_id:'123456789'}, user))
      .end((err,res) => {
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
      .set('Authorization', authorizationHeader(user))
      .send(newUser)
      .end((err,res) => {
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
