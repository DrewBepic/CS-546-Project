import userRoutes from './items.js';
const constructorMethod = (app) => {
  app.use('/', userRoutes);
  app.use('*', (req, res) => {
    return res.redirect('/');
  });
};

export default constructorMethod;