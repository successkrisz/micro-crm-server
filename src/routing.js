import koaRouter from 'koa-router';

import userController from './controllers/userController';
import clientController from './controllers/clientController';
import { login, roleAuthorization } from './controllers/authenticationController';

const api = 'api';
const router = koaRouter();

router.prefix(`/${api}`);
router.post('/login', login);
router.get('/users', roleAuthorization(), userController.getAllUsers)
router.post('/user', roleAuthorization(), userController.addUser);
router.get('/user/:id', roleAuthorization(), userController.getUser);
router.put('/user', roleAuthorization(), userController.updateUser);
router.delete('/user/:id', roleAuthorization(), userController.deleteUser);

router.get('/clients', roleAuthorization(), clientController.getAllClients);

router.get('/client/:id', roleAuthorization(), clientController.getClient);
router.post('/client', roleAuthorization(), clientController.addClient);
router.put('/client', roleAuthorization(), clientController.updateClient);
router.delete('/client/:id', roleAuthorization(), clientController.deleteClient);

export default router;
