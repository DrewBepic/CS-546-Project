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

router.route('/item/:itemid').get(async (req, res) => {
  try {
    const item = await itemCommands.getItemByID(req.params.itemid)
    const userName = await userCommands.getUserByID(item.ownerId.toString())
    item.owner = userName.name
    return res.render('item', { hasErrors: false, title: "CampusExchange", itemInfo: item });
  } catch (e) {
    return res.render('item', { hasErrors: true, title: "CampusExchange", error: e,user:req.session.user });
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

router.route('/items/search/:query').get(async (req,res) => {
  try{
    let filteredItems=await itemCommands.searchItems(req.session.user._id,req.session.user.school,req.params.query);
    if(filteredItems.length==0){
      return res.render('items',{title:"School Items",items: filteredItems,user:req.session.user,search_error:"No items found!"})
    }
    return res.render('items',{title:"School Items",items: filteredItems,user:req.session.user})
  }
  catch (e){
    console.log(e)
    return res.redirect('/items');
  }
})

router.route('/request/item/:itemId').get(async (req,res) => {
  try{
    let item=await itemCommands.getItemByID(req.params.itemId);
    let itemOwner=await userCommands.getUserByID(item.ownerId)
    item.owner=itemOwner.name
    return res.render('requestItem',{user:req.session.user,itemInfo:item})
  }
  catch (e){
    console.log(e);
    return res.redirect("/items");
  }
})
.post(async (req, res) => {
  try{
    let item=await itemCommands.getItemByID(req.params.itemId);
    let requestId=await requestCommands.createRequest(item.ownerId,req.session.user._id,req.params.itemId,req.body.description);
    return res.redirect('/request/'+requestId);
  }
  catch (e){
    console.log(e);
    return res.redirect("/items");
  }
});

router.route('/request/:requestId').get(async (req,res) => {
  try{
    let request=await requestCommands.getRequestByID(req.params.requestId);
    let item=await itemCommands.getItemByID(request.ItemID);
    let lender=await userCommands.getUserByID(request.LenderID);
    let borrower=await userCommands.getUserByID(request.BorrowerID);
    let isLender=false;
    let isBorrower=false;
    let isAccepted=false;
    let isPending=false;
    if(req.session.user._id==lender._id){
      isLender=true;
    }
    if(req.session.user._id==borrower._id){
      isBorrower=true;
    }
    if(request.Status=="Accepted"){
      isAccepted=true;
    }
    if(request.Status=="Pending"){
      isPending=true;
    }
    return res.render('request',{user:req.session.user,request:request,item:item,lender:lender,borrower:borrower,isLender,isBorrower,isAccepted,isPending})
  }
  catch (e){
    console.log(e);
    return res.redirect("/items");
  }
})

router.route('/logout').get(async (req,res) => {
  if(!req.session.user){
    return res.redirect('/login');
  }
  req.session.destroy();
  return res.redirect('/login');
})

export default router;