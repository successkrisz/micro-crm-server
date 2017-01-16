import user from './controllers/user';
import client from './controllers/client';
import {login, roleAuthorization} from './controllers/authentication';

export default router => {
  const api = 'api'
  router.prefix(`/${api}`);
  router.post('/login', login);
  router.get('/users', roleAuthorization(), user.getAllUsers)
  router.post('/user', roleAuthorization(), user.addUser);
  router.get('/user/:id', roleAuthorization(), user.getUser);
  router.put('/user', roleAuthorization(), user.updateUser);
  router.delete('/user/:id', roleAuthorization(), user.deleteUser);

  router.get('/clients', roleAuthorization(), client.getAllClients);

  router.get('/client/:id', roleAuthorization(), client.getClient);
  router.post('/client', roleAuthorization(), client.addClient);
  router.put('/client', roleAuthorization(), client.updateClient);
  router.delete('/client/:id', roleAuthorization(), client.deleteClient);

  return router;
}
