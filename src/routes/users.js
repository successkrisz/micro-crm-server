import User from '../models/User';

async function login(ctx, next) {
  ctx.body = 'Matched Login';
}

async function getAllUsers(ctx, next) {
  try {
    const users = await User.find();
    if (users === null || users.length === 0) {
      ctx.body = {error: 'There\'s no users in the database!'}
    } else {
      ctx.body = users.map(user => {
        user['password'] = undefined;
        user['__v'] = undefined;
        return user;
      });
    }
  } catch (e) {
    ctx.body = {error: 'Database error'};
  }
}

async function addUser(ctx, next) {
  const newUser = new User({
    email: ctx.request.body.email,
    password: ctx.request.body.password,
    profile: { firstName: ctx.request.body.firstName, lastName: ctx.request.body.lastName }
  });
  try {
    let user = await newUser.save();
    user['__v'] = undefined;
    user['password'] = undefined;
    ctx.body = user;
  } catch(e) {
    ctx.body = e.errors;
  }
}

async function getUser(ctx, next) {
  var user;
  try {
    user = await User.findById(ctx.params.id);
    if (user === null) {
      ctx.body = {error: 'The requested user doesn\'t exist!'};
    } else {
      ctx.body = user;
    }
  } catch(e) {
      // if id cannot be accepted send the same error message
      ctx.body = {error: 'The requested user doesn\'t exist!'}
  }
}

async function updateUser(ctx, next) {
  const id = ctx.request.body._id;
  let updatedUser = ctx.request.body;
  delete updatedUser['_id'];
  try {
    let user = await User.findByIdAndUpdate(id, { $set: updatedUser }, { new: true, runValidators: true });
    user['__v'] = undefined;
    user['password'] = undefined;
    if (user === null) {
      ctx.body = {error: 'The requested user doesn\'t exist!'};
    } else {
      ctx.body = user;
    }
  } catch(e) {
    if (e.name === 'ValidationError') {
      ctx.body = e.errors;
    } else {
      ctx.body = {error: 'The requested user doesn\'t exist!'};
    }
  }
}

async function deleteUser(ctx, next) {
  try {
    let user = await User.findByIdAndRemove(ctx.params.id);
    user['__v'] = undefined;
    user['password'] = undefined;
    if (user === null) {
      ctx.body = {error: 'The requested user doesn\'t exist!'};
    } else {
      ctx.body = user;
    }
  } catch(e) {
    ctx.body = {error: 'The requested user doesn\'t exist!'};
  }
}

async function temp(ctx, next) {
  ctx.body = 'temp route';
}

export default {
  login,
  temp,
  getAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser
};
