import userRoutes from './users.js';
const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('*', (req, res) => {
    return res.redirect('/');
  });
};

export default constructorMethod;