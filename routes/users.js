import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'

router.route('/').get(async (req, res) => {
  return res.render('home', {title: "CampusExchange"});
});

router.route('/items').get(async (req, res) => {
  const items = await itemCommands.getAllItems()
  return res.render('items', {title: "CampusExchange", items: items});
});

router.route('/item').get(async (req, res) => {
  return res.render('addItem', {hasErrors: false, title: "CampusExchange"});
})

.post(async (req, res) => {
  let body = req.body
  try{
    if(!req.session.user){
      throw "Login before adding an item"
    }
    await itemCommands.addItem(req.session.user._id, body.name, body.description)
    return res.redirect('/item');
  }catch(e){
    return res.status(400).render('addItem', { hasErrors: true, title: 'CampusExchange', error: e.toString()});
  }
});

router.route('/item/:itemid').get(async (req, res) => {
  const item = await itemCommands.getItemByID(req.params.itemid)
  const userName = await userCommands.getUserByID(item.ownerId.toString())
  console.log(userName)
  item.owner = userName.name
  return res.render('item', {hasErrors: false, title: "CampusExchange", itemInfo: item});
})

router.route('/login').get(async (req, res) => {
  return res.render('login', {title: "CampusExchange"});
})
.post(async (req, res) => {
  const loginData = req.body;
    try {
        const user = await userCommands.userLogin(loginData.email, loginData.password);
        if (user) {
            req.session.user = user
            return res.redirect('/item');
        } else {
            throw 'User not logged in'
        }
    } catch (e) {
        console.log(e);
        return res.status(500).render('login', { hasErrors: true, error: e, title: 'Login' });
    }
});

export default router;