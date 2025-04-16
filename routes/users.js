import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'

router.route('/').get(async (req, res) => {
  return res.render('home', {title: "CampusExchange"});
});

router.route('/items').get(async (req, res) => {
  const items = await items()
  return res.render('items', {title: "CampusExchange", items: items});
});

router.route('/item').get(async (req, res) => {
  return res.render('addItem', {title: "CampusExchange"});
})

.post(async (req, res) => {
  let id = "67fea618712c0f89deb97359"
  console.log(id)
  let body = req.body
  // try{
    await itemCommands.addItem(id, body.name, body.description)
    return res.redirect('/item');
  // }catch(e){
  //   return res.status(400).render('error', {title: 'Error', error: e.toString()});
  // }
});

router.route('/login').get(async (req, res) => {
  return res.render('login', {title: "CampusExchange"});
})
.post(async (req, res) => {
  const loginData = req.body;
    try {
        const user = await userCommands.userLogin(loginData.email, loginData.password);
        console.log(JSON.stringify(user))
        if (user) {
            req.session.user = user
            console.log(req.session.user)
            return res.redirect('/item');
        } else {
            throw 'User not logged in'
        }
    } catch (e) {
        console.log(e);
        return res.status(500).render('login', { hasErrors: true, error: e, title: 'Login' });
    }
})

export default router;