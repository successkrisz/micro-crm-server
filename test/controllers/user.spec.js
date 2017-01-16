import {expect} from 'chai';
import user from '../../src/controllers/user';
import User from '../../src/models/User';
import mongoose from 'mongoose';
import config from 'config';

if (!mongoose.connection.readyState) {
// Set up mongoose connection
  const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
  };
  mongoose.Promise = global.Promise;
  mongoose.connect(config.DBHost, options);
}

function mockCtx(body = {}){
  return {request: {body: body}, body: '', params: {id: ''}};
}


describe('User Controller: ', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });

  it('adduser saves user', async () => {
    let ctx = mockCtx({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    await user.addUser(ctx)
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.password).to.equal(undefined);
    expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
  });

  it('addUser returns error when no valid email is supplied', async () => {
    let ctx = mockCtx({
      email: 'kriszi.balla@gmail',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    await user.addUser(ctx)
    expect(ctx.body.email.name).to.equal('ValidatorError');
  });

  it('getAllUsers returns all users in database', async () => {
    let ctx = mockCtx();
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    const user2 = new User({
      email: 'dani.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Dani',
        lastName: 'Balla'
      }
    });
    await user1.save();
    await user2.save();

    await user.getAllUsers(ctx);
    expect(ctx.body[0].profile.lastName).to.equal('Balla');
    expect(ctx.body[1].profile.lastName).to.equal('Balla');
  });

  it('getUser returns user when id is a match', async () => {
    let ctx = mockCtx();
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    const savedUser = await user1.save();
    ctx.params.id = savedUser['_id'];

    await user.getUser(ctx);
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.password).to.equal(undefined);
    expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
  });

  it('getUser returns error message when id not exist', async () => {
    let ctx = mockCtx();
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    await user1.save();
    ctx.params.id = 'illegal id';

    await user.getUser(ctx);;
    expect(ctx.body).to.have.property('error');
    expect(ctx.body.error).to.equal('The requested user doesn\'t exist!');
  });

  it('updateUser update user when id exists', async () => {
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    const savedUser = await user1.save();
    let ctx = mockCtx({
      _id: savedUser['_id'],
      email: 'daniel.balla@gmail.com',
    });
    await user.updateUser(ctx);
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.email).to.equal('daniel.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
  });

  it('updateUser returns error when id doesn\'t exist', async () => {
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    await user1.save();
    let ctx = mockCtx({
      _id: 'illegal id',
      email: 'daniel.balla@gmail.com'
    });
    await user.updateUser(ctx);
    expect(ctx.body).to.have.property('error');
    expect(ctx.body.error).to.equal('The requested user doesn\'t exist!');
  });

  it('deleteUser deletes user when id exist', async () => {
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    const savedUser = await user1.save();
    let ctx = mockCtx();
    ctx.params.id = savedUser['_id'];
    await user.deleteUser(ctx);
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
  });

  it('deleteUser returns error when id doesn\'t exist', async () => {
    const user1 = new User({
      email: 'kriszi.balla@gmail.com',
      password: 'password',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla'
      }
    });
    await user1.save();
    let ctx = mockCtx();
    ctx.params.id = 'illegal id';
    await user.deleteUser(ctx);
    expect(ctx.body).to.have.property('error');
    expect(ctx.body.error).to.equal('The requested user doesn\'t exist!');
  });

});
