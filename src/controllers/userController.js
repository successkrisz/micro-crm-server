import _debug from 'debug';

import User from '../models/User';

const debug = _debug('app:userController');

async function getAllUsers (ctx) {
    try {
        const users = await User.find();

        ctx.body = users.map(cleanUser);
    } catch (error) {
        ctx.status = 500;
        debug(`Error while trying to retrieve all Users from database: ${error}`);
    }
}

async function addUser (ctx) {
    const newUser = new User(ctx.request.body);

    try {
        const user = await newUser.save();

        ctx.body = cleanUser(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            ctx.body = error.errors;
            return;
        }
        ctx.status = 500;
        debug(`Error while trying to save new User to database: ${error}`);
    }
}

async function getUser (ctx) {
    try {
        const user = await User.findById(ctx.params.id);

        if (user === null) {
            ctx.status = 404;
            return;
        }
        ctx.body = cleanUser(user);
    } catch (error) {
        ctx.status = 404;
    }
}

async function updateUser (ctx) {
    const id = ctx.request.body._id;
    let updatedUser = Object.assign({}, ctx.request.body);

    delete updatedUser['_id'];

    try {
        const user = await User.findByIdAndUpdate(id, { $set: updatedUser }, { new: true, runValidators: true });

        if (user === null) {
            ctx.status = 404;
            return;
        }
        ctx.body = cleanUser(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            ctx.body = error.errors;
            return;
        }
        ctx.status = 404;
    }
}

async function deleteUser (ctx) {
    try {
        const user = await User.findByIdAndRemove(ctx.params.id);

        if (user === null) {
            ctx.status = 404;
            return;
        }
        ctx.body = cleanUser(user);
    } catch (error) {
        ctx.status = 404;
    }
}

function cleanUser (user) {
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
