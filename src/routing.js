import users from './routes/users';

export default router => {
  const api = 'api'
  router.prefix(`/${api}`);
  router.post('/login', users.login);
  router.get('/users', users.getAllUsers)
  router.post('/user', users.addUser);
  router.get('/user/:id', users.getUser);
  router.put('/user', users.updateUser);
  router.delete('/user/:id', users.deleteUser);

  router.get('/clients', users.temp);

  router.get('/client/:id', users.temp);
  router.post('/client', users.temp);
  router.put('/client', users.temp);
  router.delete('/client', users.temp);

  return router;
}
