import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'

router.route('/').get(async (req, res) => {
  return res.render('home', { title: "CampusExchange" });
});

router.route('/login').get(async (req, res) => {
  return res.render('login', { title: "CampusExchange" });
})
  .post(async (req, res) => {
    const loginData = req.body;
    try {
      const user = await userCommands.userLogin(loginData.email, loginData.password);
      if (user) {
        req.session.user = user;
        return res.redirect('/items');
      } else {
        throw 'User not logged in'
      }
    } catch (e) {
      return res.status(500).render('login', { hasErrors: true, error: e, title: 'Login' });
    }
  });

router.route('/register').get(async (req, res) => {
  return res.render('register', { title: "CampusExchange" });
})
  .post(async (req, res) => {
    try {
      const registerData = req.body;
      await userCommands.registerUser(registerData.name, registerData.email, registerData.password, registerData.confirmPassword)
      let user = await userCommands.userLogin(registerData.email, registerData.password);
      if (user) {
        req.session.user = user
        return res.redirect('/items');
      } else {
        throw 'User not logged in'
      }
    } catch (e) {
      return res.status(500).render('register', { hasErrors: true, error: e, title: 'Register' });
    }
  });





router.route('/logout').get(async (req,res) => {
  if(!req.session.user){
    return res.redirect('/login');
  }
  req.session.destroy();
  return res.redirect('/login');
})

export default router;