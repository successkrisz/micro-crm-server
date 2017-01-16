import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index.js';
import User from '../src/models/User';
const should = chai.should();

chai.use(chaiHttp);

describe.skip('Test API endpoints', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  it('/GET /api/users : returning {error: \'There\'s no users in the database!\'} when empty', (done) => {
    chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('There\'s no users in the database!');
        done();
      });
  });

  it('/GET /api/users :  returning users when they exist', (done) => {
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Kriszi', lastName: 'Balla' }
    });
    user1.save();
    const user2 = new User({
      email: 'krisztian.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Krisztian', lastName: 'Balla' }
    });
    user2.save();

    chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(2);
        res.body[0].should.have.property('email').eql('kriszi.balla@gmail.com');
        res.body[0].should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('createdAt');
        res.body[0].should.have.property('updatedAt');
        res.body[0].should.have.property('role').eql('Member');
        res.body[1].should.have.property('email').eql('krisztian.balla@gmail.com');
        res.body[1].should.have.property('profile').eql({ firstName: 'Krisztian', lastName: 'Balla' });
        res.body[1].should.have.property('_id');
        res.body[1].should.have.property('createdAt');
        res.body[1].should.have.property('updatedAt');
        res.body[1].should.have.property('role').eql('Member');
        done();
      });
  });

  it('/POST /api/user : creates new user when email,password,first name and last name provided', (done) => {
    const user = {
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      firstName: 'Kriszi',
      lastName: 'Balla'
    }
    chai.request(server)
      .post('/api/user')
      .send(user)
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('email').eql('kriszi.balla@gmail.com');
        res.body.should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
        res.body.should.have.property('_id');
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        res.body.should.have.property('role').eql('Member');
        done();
      });
  });

  it('/POST /api/user : return error when password not provided', (done) => {
    const user = {
      email: 'kriszi.balla@gmail.com',
      firstName: 'Kriszi',
      lastName: 'Balla'
    }
    chai.request(server)
      .post('/api/user')
      .send(user)
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('password')
        res.body.password.should.have.property('message');
        res.body.password.message.should.eql('Password required!');
        done();
      });
  });

  it('/GET /api/user : return error when ID don\'t exist', (done) => {
    chai.request(server)
      .get('/api/user/123456789')
      .end((err,res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('error')
        res.body.error.should.eql('The requested user doesn\'t exist!');
        done();
      });
  });

  it('/GET /api/user : return User when ID exist', (done) => {
    const user = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Kriszi', lastName: 'Balla' }
    });
    user.save()
      .then(savedUser => {
        chai.request(server)
          .get('/api/user/' + savedUser._id)
          .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('email').eql('kriszi.balla@gmail.com');
            res.body.should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
            res.body.should.have.property('_id');
            res.body.should.have.property('createdAt');
            res.body.should.have.property('updatedAt');
            res.body.should.have.property('role').eql('Member');
            done();
          });
      });
  });

  it('/DELETE /api/user :  deleting user when ID exists', (done) => {
    const user = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Kriszi', lastName: 'Balla' }
    });
    user.save()
      .then(savedUser => {
        chai.request(server)
        .delete('/api/user/' + savedUser._id)
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('kriszi.balla@gmail.com');
          res.body.should.have.property('profile').eql({ firstName: 'Kriszi', lastName: 'Balla' });
          res.body.should.have.property('_id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('role').eql('Member');
          done();
        });
    });
  });

  it('/DELETE /api/user :  return error when ID don\'t exist', (done) => {
    chai.request(server)
    .delete('/api/user/123456789')
    .end((err,res) => {
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('error').eql('The requested user doesn\'t exist!');
      done();
    });
  });

  it('/PUT /api/user :  return error when ID don\'t exist', (done) => {
    const user = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Kriszi', lastName: 'Balla' }
    });
    user.save()
      .then( (savedUser) => {
        chai.request(server)
        .put('/api/user')
        .send(Object.assign({_id:'123456789'}, savedUser))
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('error').eql('The requested user doesn\'t exist!');
          done();
        });
    });
  });

  it('/PUT /api/user :  update user when ID exists', (done) => {
    const user = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: { firstName: 'Kriszi', lastName: 'Balla' }
    });
    user.save()
      .then(savedUser => {
        savedUser.email = 'john.doe@yahoo.com';
        savedUser.profile.firstName = 'John';
        savedUser.profile.lastName = 'Doe';
        chai.request(server)
        .put('/api/user')
        .send(savedUser)
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('john.doe@yahoo.com');
          res.body.should.have.property('profile').eql({ firstName: 'John', lastName: 'Doe' });
          res.body.should.have.property('_id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');
          res.body.should.have.property('role').eql('Member');
          done();
        });
    });
  });
});
