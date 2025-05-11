import userRoutes from './users.js';
import requestRoutes from './requests.js'
import itemRoutes from './items.js'
const constructorMethod = (app) => {
  app.use('/',itemRoutes);
  app.use('/', userRoutes);
  app.use('/',requestRoutes);
  app.use('*', (req, res) => {
    return res.redirect('/');
  });
};

export default constructorMethod;