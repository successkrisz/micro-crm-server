import _debug from 'debug';

import Client from '../models/Client';

const debug = _debug('app:clientController');

async function getAllClients(ctx) {
  try {
    const clients = await Client.find();
    if (clients === null || clients.length === 0) return ctx.body = {};
    ctx.body = clients;
  } catch (e) {
    ctx.status = 500;
    debug('Error while trying to retrieve all Clients from database: ' + e);
  }
}

async function addClient(ctx) {
  const newClient = new Client(ctx.request.body);
  try {
    ctx.body = await newClient.save();
  } catch(e) {
    if (e.name === 'ValidationError') return ctx.body = e.errors;
    ctx.status = 500;
    debug('Error while trying to save new Client to database: ' + e);
  }
}

async function getClient(ctx) {
  try {
    const client = await Client.findById(ctx.params.id);
    if (client === null) return ctx.status = 404;
    ctx.body = client;
  } catch(e) {
    ctx.status = 404;
  }
}

async function updateClient(ctx) {
  const id = ctx.request.body._id;
  let updatedClient = Object.assign({}, ctx.request.body);
  delete updatedClient['_id'];
  try {
    const client = await Client.findByIdAndUpdate(id, { $set: updatedClient }, { new: true, runValidators: true });
    if (client === null) return ctx.status = 404;
    ctx.body = client;
  } catch(e) {
    if (e.name === 'ValidationError') return ctx.body = e.errors;
    ctx.status = 404;
  }
}

async function deleteClient(ctx) {
  try {
    const client = await Client.findByIdAndRemove(ctx.params.id);
    if (client === null) return ctx.status = 404;
    ctx.body = client;
  } catch(e) {
    ctx.status = 404;
  }
}

export default {
  getAllClients,
  addClient,
  getClient,
  updateClient,
  deleteClient,
};
