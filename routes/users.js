import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'

router.route('/').get(async (req, res) => {
  return res.render('home', { title: "CampusExchange" });
});

router.route('/items').get(async (req, res) => {
  let items=await itemCommands.getItemsBySchool(req.session.user._id,req.session.user.school);
  if(items.length==0){
    items=null;
  }
  return res.render('items',{title:"School Items",items: items,user:req.session.user})
});


router.route('/item').get(async (req, res) => {
  return res.render('addItem', { hasErrors: false, title: "CampusExchange", user:req.session.user });
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

router.route('/user/:userid').get(async (req, res) => {
  let loanedItems =await userCommands.getLoanedItemsByUserID(req.session.user._id);
  let borrowedItems =await userCommands.getBorrowedItemsByUserID(req.session.user._id);
  let ownedItems = await userCommands.getOwnedItemsByUserID(req.session.user._id);
  let karma = await userCommands.getKarmaByUserID(req.session.user._id);

  if(loanedItems.length==0){
    loanedItems=null;
  }
  if(borrowedItems.length==0){
    borrowedItems=null;
  }
  if(ownedItems.length==0){
    ownedItems=null;
  }

  return res.render('user',{title:"User Profile", loanedItems: loanedItems, borrowedItems: borrowedItems, ownedItems: ownedItems, karma: karma, user:req.session.user})
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


router.route('/user/:userid/wishlist').get(async (req, res) => {
  let wishlist = await itemCommands.getWishListByUserID(req.session.user._id);
  if(wishlist.length==0){
    wishlist=null;
  }

  return res.render('wishlist',{title:"User Wishlist", wishlist: wishlist, user:req.session.user})
});

router.route('/user/:userid/wishlist/:itemId/remove').post(async (req, res) => {
  const userId = req.params.userid;
  const itemId = req.params.itemId;
  
  try {
    const removed = await itemCommands.removeFromWishlist(userId, itemId);
    if (!removed) throw 'Item not found or not in wishlist';
    return res.redirect('/user/' + userId + '/wishlist');
  } catch (e) {
    return res.status(404).json({ error: e });
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