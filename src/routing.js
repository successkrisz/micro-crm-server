import user from './controllers/user';
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

  router.get('/clients', user.temp);

  router.get('/client/:id', user.temp);
  router.post('/client', user.temp);
  router.put('/client', user.temp);
  router.delete('/client', user.temp);

  return router;
}
