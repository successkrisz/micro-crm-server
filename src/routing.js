import user from './controllers/user';
import client from './controllers/client';
import {login, roleAuthorization} from './controllers/authentication';

export default router => {
  const api = 'api'
  router.prefix(`/${api}`);
  router.post('/login', login);
  router.get('/users', roleAuthorization(), user.getAllUsers)
  router.post('/user', user.addUser);
  router.get('/user/:id', roleAuthorization(), user.getUser);
  router.put('/user', roleAuthorization(), user.updateUser);
  router.delete('/user/:id', roleAuthorization(), user.deleteUser);

  router.get('/clients', client.getAllClients);

  router.get('/client/:id', clients.getClient);
  router.post('/client', clients.addClient);
  router.put('/client', clients.updateClient);
  router.delete('/client/:id', clients.deleteClient);

  return router;
}
