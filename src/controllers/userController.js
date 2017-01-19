import _debug from 'debug';

import User from '../models/User';

const debug = _debug('app:userController');

async function getAllUsers(ctx) {
    try {
        const users = await User.find();

        if (users === null || users.length === 0) { return ctx.status = 404; }
        ctx.body = users.map(cleanUser);
    } catch (e) {
        ctx.status = 500;
        debug(`Error while trying to retrieve all Users from database: ${e}`);
    }
}

async function addUser(ctx) {
    const newUser = new User(ctx.request.body);

    try {
        const user = await newUser.save();

        ctx.body = cleanUser(user);
    } catch(e) {
        if (e.name === 'ValidationError') { return ctx.body = e.errors; }
        ctx.status = 500;
        debug(`Error while trying to save new User to database: ${e}`);
    }
}

async function getUser(ctx) {
    try {
        const user = await User.findById(ctx.params.id);

        if (user === null) { return ctx.status = 404; }
        ctx.body = cleanUser(user);
    } catch(e) {
        ctx.status = 404;
    }
}

async function updateUser(ctx) {
    const id = ctx.request.body._id;
    let updatedUser = Object.assign({}, ctx.request.body);

    delete updatedUser['_id'];

    try {
        const user = await User.findByIdAndUpdate(id, { $set: updatedUser }, { new: true, runValidators: true });

        if (user === null) { return ctx.status = 404; }
        ctx.body = cleanUser(user);
    } catch(e) {
        if (e.name === 'ValidationError') { return ctx.body = e.errors; }
        ctx.status = 404;
    }
}

async function deleteUser(ctx) {
    try {
        const user = await User.findByIdAndRemove(ctx.params.id);

        if (user === null) { return ctx.status = 404; }
        ctx.body = cleanUser(user);
    } catch(e) {
        ctx.status = 404;
    }
}

function cleanUser(user) {
    let userCopy = Object.assign({}, user._doc);

    delete userCopy['password'];
    delete userCopy['__v'];
    return userCopy;
}

export default {
    getAllUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser
};
