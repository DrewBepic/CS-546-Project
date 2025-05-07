import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'

router.route('/').get(async (req, res) => {
  return res.render('home', { title: "CampusExchange" });
});

router.route('/home').get(async (req, res) => {
  let items=await itemCommands.getItemsBySchool(req.session.user._id,req.session.user.school);
  console.log(items.length,items,items[0]);
  return res.render('availableItems',{title:"School Items",items: items,user:req.session.user})
});

router.route('/items').get(async (req, res) => {
  const items = await itemCommands.getAllItems()
  return res.render('items', { title: "CampusExchange", items: items });
});

router.route('/item').get(async (req, res) => {
  return res.render('addItem', { hasErrors: false, title: "CampusExchange" });
})

  .post(async (req, res) => {
    let body = req.body
    try {
      if (!req.session.user) {
        throw "Login before adding an item"
      }
      const newItem = await itemCommands.addItem(req.session.user._id, body.name, body.description)
      const newItemID = newItem._id
      return res.redirect('/item/' + newItemID);
    } catch (e) {
      return res.status(400).render('addItem', { hasErrors: true, title: 'CampusExchange', error: e.toString() });
    }
  });

router.route('/item/:itemid').get(async (req, res) => {
  try {
    const item = await itemCommands.getItemByID(req.params.itemid)
    const userName = await userCommands.getUserByID(item.ownerId.toString())
    item.owner = userName.name
    return res.render('item', { hasErrors: false, title: "CampusExchange", itemInfo: item });
  } catch (e) {
    return res.render('item', { hasErrors: true, title: "CampusExchange", error: e });
  }
})

router.route('/login').get(async (req, res) => {
  return res.render('login', { title: "CampusExchange" });
})
  .post(async (req, res) => {
    const loginData = req.body;
    try {
      const user = await userCommands.userLogin(loginData.email, loginData.password);
      if (user) {
        req.session.user = user
        return res.redirect('/home');
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
        return res.redirect('/home');
      } else {
        throw 'User not logged in'
      }
    } catch (e) {
      return res.status(500).render('register', { hasErrors: true, error: e, title: 'Register' });
    }
  });

router.route('/comment/:itemId').post(async (req, res) => {
  try {
    const comment = req.body.comment
    const itemID = req.params.itemId;
    const commentAdd = await itemCommands.addComment(itemID,comment)
    if(!commentAdd){
      throw "Could not add comment"
    }
    return res.redirect('/item/' + itemID.toString());
  } catch (e) {
    return res.redirect('/item/' + req.params.itemId.toString());
  }
});
export default router;