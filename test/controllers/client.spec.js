import {expect} from 'chai';
import client from '../../src/controllers/client';
import Client from '../../src/models/Client';
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

describe('Client Controller: ', () => {
  beforeEach((done) => {
    Client.remove({}, (err) => {
      done();
    });
  });

  it('addClient saves client', async () => {
    let ctx = mockCtx({
      email: 'kriszi.ballaz@gmail.com',
      phone: '123456789',
      postcode: 'N16 9HS',
      address: '16 xxx street',
      notes: 'MockUser',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    await client.addClient(ctx)
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.email).to.equal('kriszi.ballaz@gmail.com');
    expect(ctx.body.phone).to.equal('123456789');
    expect(ctx.body.postcode).to.equal('N16 9HS');
    expect(ctx.body.address).to.equal('16 xxx street');
    expect(ctx.body.notes).to.equal('MockUser');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
    expect(ctx.body.profile.birthday).to.equal('01/01/1985');
  });

  it('addClient returns error when no name is supplied', async () => {
    let ctx = mockCtx({
      email: 'kriszi.ballaz@gmail.com',
      phone: '123456789',
      postcode: 'N16 9HS',
      address: '16 xxx street',
      notes: 'MockUser',
      profile: {
        firstName: '',
        lastName: '',
        birthday: '01/01/1985'
      }
    });
    await client.addClient(ctx)
    expect(ctx.body['profile.firstName'].name).to.equal('ValidatorError');
    expect(ctx.body['profile.lastName'].name).to.equal('ValidatorError');
  });

  it('getAllClients returns all clients in database', async () => {
    let ctx = mockCtx();
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    const client2 = new Client({
      email: 'daniel.balla@gmail.com',
      profile: {
        firstName: 'Daniel',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    await client1.save();
    await client2.save();

    await client.getAllClients(ctx);
    expect(ctx.body[0].profile.lastName).to.equal('Balla');
    expect(ctx.body[0].profile.birthday).to.equal('01/01/1985');
    expect(ctx.body[1].profile.lastName).to.equal('Balla');
    expect(ctx.body[1].profile.birthday).to.equal('01/01/1985');
  });

  it('getClient returns client when id is a match', async () => {
    let ctx = mockCtx();
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    const savedClient = await client1.save();
    ctx.params.id = savedClient['_id'];

    await client.getClient(ctx);
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
    expect(ctx.body.profile.birthday).to.equal('01/01/1985');
  });

  it('getClient returns error message when id not exist', async () => {
    let ctx = mockCtx();
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    await client1.save();
    ctx.params.id = 'illegal id';
    await client.getClient(ctx);
    expect(ctx.body).to.have.property('error');
    expect(ctx.body.error).to.equal('The requested client doesn\'t exist!');
  });

  it('updateClient update client when id exists', async () => {
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    const savedClient = await client1.save();
    let ctx = mockCtx({
      _id: savedClient['_id'],
      email: 'daniel.balla@gmail.com',
      profile: {
        firstName: 'Daniel',
        lastName: 'Balla',
        birthday: '01/01/1987'
      }
    });
    await client.updateClient(ctx);
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.email).to.equal('daniel.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Daniel');
    expect(ctx.body.profile.lastName).to.equal('Balla');
    expect(ctx.body.profile.birthday).to.equal('01/01/1987');
  });

  it('updateClient returns error when id doesn\'t exist', async () => {
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    const savedClient = await client1.save();
    let ctx = mockCtx({
      _id: 'illegal id',
      email: 'daniel.balla@gmail.com',
      profile: {
        firstName: 'Daniel',
        lastName: 'Balla',
        birthday: '01/01/1987'
      }
    });
    await client.updateClient(ctx);
    expect(ctx.body).to.have.property('error');
    expect(ctx.body.error).to.equal('The requested client doesn\'t exist!');
  });

  it('deleteClient deletes client when id exist', async () => {
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    const savedClient = await client1.save();
    let ctx = mockCtx();
    ctx.params.id = savedClient['_id'];
    await client.deleteClient(ctx);
    expect(ctx.body).to.have.property('_id');
    expect(ctx.body).to.have.property('updatedAt');
    expect(ctx.body).to.have.property('createdAt');
    expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
    expect(ctx.body.profile.firstName).to.equal('Krisztian');
    expect(ctx.body.profile.lastName).to.equal('Balla');
    expect(ctx.body.profile.birthday).to.equal('01/01/1985');
  });

  it('deleteClient returns error when id doesn\'t exist', async () => {
    const client1 = new Client({
      email: 'kriszi.balla@gmail.com',
      profile: {
        firstName: 'Krisztian',
        lastName: 'Balla',
        birthday: '01/01/1985'
      }
    });
    await client1.save();
    let ctx = mockCtx();
    ctx.params.id = 'illegal id';
    await client.deleteClient(ctx);
    expect(ctx.body).to.have.property('error');
    expect(ctx.body.error).to.equal('The requested client doesn\'t exist!');
  });

});
