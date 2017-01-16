import Client from '../models/Client';
const CLIENT_NOT_EXIST = {error: 'The requested client doesn\'t exist!'};

async function getAllClients(ctx, next) {
  try {
    const clients = await Client.find();
    if (clients === null || clients.length === 0) {
      ctx.body = {error: 'There\'s no clients in the database!'}
    } else {
      ctx.body = clients;
    }
  } catch (e) {
    ctx.body = {error: 'Database error'};
  }
}

async function addClient(ctx, next) {
  const newClient = new Client(ctx.request.body);
  try {
    ctx.body = await newClient.save();
  } catch(e) {
    ctx.body = e.errors;
  }
}

async function getClient(ctx, next) {
  try {
    const client = await Client.findById(ctx.params.id);
    if (client === null) {
      ctx.body = CLIENT_NOT_EXIST;
    } else {
      ctx.body = client;
    }
  } catch(e) {
      ctx.body = CLIENT_NOT_EXIST
  }
}

async function updateClient(ctx, next) {
  const id = ctx.request.body._id;
  let updatedClient = ctx.request.body;
  delete updatedClient['_id'];
  try {
    const client = await Client.findByIdAndUpdate(id, { $set: updatedClient }, { new: true, runValidators: true });
    if (client === null) {
      ctx.body = CLIENT_NOT_EXIST;
    } else {
      ctx.body = client;
    }
  } catch(e) {
    if (e.name === 'ValidationError') {
      ctx.body = e.errors;
    } else {
      ctx.body = CLIENT_NOT_EXIST;
    }
  }
}

async function deleteClient(ctx, next) {
  try {
    const client = await Client.findByIdAndRemove(ctx.params.id);
    if (client === null) {
      ctx.body = CLIENT_NOT_EXIST;
    } else {
      ctx.body = client;
    }
  } catch(e) {
    ctx.body = CLIENT_NOT_EXIST;
  }
}

export default {
  getAllClients,
  addClient,
  getClient,
  updateClient,
  deleteClient,
};
