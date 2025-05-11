import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'

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

router.route('/item/:itemid').get(async (req, res) => {
  try {
    const item = await itemCommands.getItemByID(req.params.itemid)
    const userName = await userCommands.getUserByID(item.ownerId.toString())
    item.owner = userName.name
    return res.render('item', { hasErrors: false, title: "CampusExchange", itemInfo: item ,user:req.session.user});
  } catch (e) {
    return res.render('item', { hasErrors: true, title: "CampusExchange", error: e,user:req.session.user ,user:req.session.user});
  }
})

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
    return res.redirect('/items');
  }
})

export default router;