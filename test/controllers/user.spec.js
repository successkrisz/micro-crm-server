import {expect} from 'chai';
import userController from '../../src/controllers/userController';
import User from '../../src/models/User';

function mockCtx(body = {}){
    return {
        request: {body: body},
        body: '',
        status: '',
        params: {id: ''}
    };
}

describe('User Controller: ', () => {
    beforeEach((done) => {
        User.remove({}, () => {
            done();
        });
    });

    it('adduser should save user', async () => {
        let ctx = mockCtx({
            email: 'kriszi.balla@gmail.com',
            password: 'password',
            profile: {
                firstName: 'Krisztian',
                lastName: 'Balla'
            }
        });
        await userController.addUser(ctx);
        expect(ctx.body).to.have.property('_id');
        expect(ctx.body).to.have.property('updatedAt');
        expect(ctx.body).to.have.property('createdAt');
        expect(ctx.body.password).to.equal(undefined);
        expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
        expect(ctx.body.profile.firstName).to.equal('Krisztian');
        expect(ctx.body.profile.lastName).to.equal('Balla');
    });

    it('addUser should return error when no valid email is supplied', async () => {
        let ctx = mockCtx({
            email: 'kriszi.balla@gmail',
            password: 'password',
            profile: {
                firstName: 'Krisztian',
                lastName: 'Balla'
            }
        });
        await userController.addUser(ctx);
        expect(ctx.body.email.name).to.equal('ValidatorError');
    });

    it('getAllUsers should return all users in database', async () => {
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

        await userController.getAllUsers(ctx);
        expect(ctx.body[0].profile.lastName).to.equal('Balla');
        expect(ctx.body[1].profile.lastName).to.equal('Balla');
    });

    it('getUser should return user when id is a match', async () => {
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

        await userController.getUser(ctx);
        expect(ctx.body).to.have.property('_id');
        expect(ctx.body).to.have.property('updatedAt');
        expect(ctx.body).to.have.property('createdAt');
        expect(ctx.body.password).to.equal(undefined);
        expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
        expect(ctx.body.profile.firstName).to.equal('Krisztian');
        expect(ctx.body.profile.lastName).to.equal('Balla');
    });

    it('getUser should return 404 when id not exist', async () => {
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

        await userController.getUser(ctx);
        expect(ctx.status).to.have.equal(404);
    });

    it('updateUser should update user when id exists', async () => {
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
        await userController.updateUser(ctx);
        expect(ctx.body).to.have.property('_id');
        expect(ctx.body).to.have.property('updatedAt');
        expect(ctx.body).to.have.property('createdAt');
        expect(ctx.body.email).to.equal('daniel.balla@gmail.com');
        expect(ctx.body.profile.firstName).to.equal('Krisztian');
        expect(ctx.body.profile.lastName).to.equal('Balla');
    });

    it('updateUser should return 404 when id doesn\'t exists', async () => {
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
        await userController.updateUser(ctx);
        expect(ctx.status).to.have.equal(404);
    });

    it('deleteUser should delete user when id exists', async () => {
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
        await userController.deleteUser(ctx);
        expect(ctx.body).to.have.property('_id');
        expect(ctx.body).to.have.property('updatedAt');
        expect(ctx.body).to.have.property('createdAt');
        expect(ctx.body.email).to.equal('kriszi.balla@gmail.com');
        expect(ctx.body.profile.firstName).to.equal('Krisztian');
        expect(ctx.body.profile.lastName).to.equal('Balla');
    });

    it('deleteUser should return 404 when id doesn\'t exist', async () => {
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
        await userController.deleteUser(ctx);
        expect(ctx.status).to.have.equal(404);
    });

});
