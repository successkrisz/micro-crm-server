import Client from '../models/Client';

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
  const newClient = new Client({
    email: ctx.request.body.email,
    phone: ctx.request.body.phone,
    postcode: ctx.request.body.postcode,
    address: ctx.request.body.address,
    notes: ctx.request.body.notes,
    profile: {
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      birthday: ctx.request.body.birthday
    }
  });
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
      ctx.body = {error: 'The requested client doesn\'t exist!'};
    } else {
      ctx.body = client;
    }
  } catch(e) {
      ctx.body = {error: 'The requested client doesn\'t exist!'}
  }
}

async function updateClient(ctx, next) {
  const id = ctx.request.body._id;
  let updatedClient = ctx.request.body;
  delete updatedClient['_id'];
  try {
    const client = await Client.findByIdAndUpdate(id, { $set: updatedClient }, { new: true, runValidators: true });
    if (client === null) {
      ctx.body = {error: 'The requested client doesn\'t exist!'};
    } else {
      ctx.body = client;
    }
  } catch(e) {
    if (e.name === 'ValidationError') {
      ctx.body = e.errors;
    } else {
      ctx.body = {error: 'The requested client doesn\'t exist!'};
    }
  }
}

async function deleteClient(ctx, next) {
  try {
    const client = await Client.findByIdAndRemove(ctx.params.id);
    if (client === null) {
      ctx.body = {error: 'The requested client doesn\'t exist!'};
    } else {
      ctx.body = client;
    }
  } catch(e) {
    ctx.body = {error: 'The requested client doesn\'t exist!'};
  }
}

export default {
  getAllClients,
  addClient,
  getClient,
  updateClient,
  deleteClient
};
