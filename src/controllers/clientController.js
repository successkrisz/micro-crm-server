import _debug from 'debug';

import Client from '../models/Client';

const debug = _debug('app:clientController');

async function getAllClients (ctx) {
  try {
    const clients = await Client.find();

    ctx.body = clients;
  } catch (error) {
    ctx.status = 500;
    debug(`Error while trying to retrieve all Clients from database: ${error}`);
  }
}

async function addClient (ctx) {
  const newClient = new Client(ctx.request.body);

  try {
    ctx.body = await newClient.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      ctx.body = error.errors;
      return;
    }
    ctx.status = 500;
    debug(`Error while trying to save new Client to database: ${error}`);
  }
}

async function getClient (ctx) {
  try {
    const client = await Client.findById(ctx.params.id);

    if (client === null) {
      ctx.status = 404;
      return;
    }
    ctx.body = client;
  } catch (error) {
    ctx.status = 404;
  }
}

async function updateClient (ctx) {
  const id = ctx.request.body._id;
  let updatedClient = Object.assign({}, ctx.request.body);

  delete updatedClient['_id'];

  try {
    const client = await Client.findByIdAndUpdate(id, { $set: updatedClient }, { new: true, runValidators: true });

    if (client === null) {
      ctx.status = 404;
      return;
    }
    ctx.body = client;
  } catch (error) {
    if (error.name === 'ValidationError') {
      ctx.body = error.errors;
      return;
    }
    ctx.status = 404;
  }
}

async function deleteClient (ctx) {
  try {
    const client = await Client.findByIdAndRemove(ctx.params.id);

    if (client === null) {
      ctx.status = 404;
      return;
    }
    ctx.body = client;
  } catch (error) {
    ctx.status = 404;
  }
}

export default {
  getAllClients,
  addClient,
  getClient,
  updateClient,
  deleteClient
};
