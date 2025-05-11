import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'

router.route('/items').get(async (req, res) => {
  let items = await itemCommands.getItemsBySchool(req.session.user._id, req.session.user.school);
  if (items.length == 0) {
    items = null;
  }
  return res.render('items', { user: req.session.user, title: "School Items", items: items })
});


router.route('/item').get(async (req, res) => {
  return res.render('addItem', { hasErrors: false, title: "CampusExchange", user: req.session.user });
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
    let owner= false;
    const item = await itemCommands.getItemByID(req.params.itemid)
    const userName = await userCommands.getUserByID(item.ownerId.toString());
     if(req.session.user._id=== item.ownerId.toString()){
      owner= true;
     }
     const wishlist= await itemCommands.getWishListByUserID(req.session.user._id);
     let inWL= false;
     for(let i=0; i<wishlist.length; i++){
      if(wishlist[i]._id.toString() === item._id.toString()){
        inWL= true;
        break;
      }
     }
    let ownerName = userName.name;
    return res.render('item', { hasErrors: false, title: "CampusExchange", itemInfo: item, ownerName: ownerName, user: req.session.user, owner: owner, inWL: inWL});
  } catch (e) {
    console.log(e);
    return res.render('item', { hasErrors: true, title: "CampusExchange", error: e, user: req.session.user });
  }
})
.post(async (req, res) => {
  try {
    const comment = req.body.comment
    const itemID = req.params.itemid;
     const user = await userCommands.getUserByID(req.session.user._id.toString());
    const commentAdd = await itemCommands.addComment(user.name,itemID, comment)
    if (!commentAdd) {
      throw "Could not add comment"
    }
    return res.redirect('/item/' + itemID.toString());
  } catch (e) {
    console.log(e);
    return res.redirect('/item/' + req.params.itemId.toString());
  }
});


 router.route('/item/wishlist/:itemid').post(async (req, res) => {
  try {
  const wishlistAdd= await itemCommands.addToWishlist(req.session.user._id.toString(), req.params.itemid)
  return res.redirect('/item/' + req.params.itemid.toString());
} catch(e){
  console.log(e);
   return res.redirect('/item/' + req.params.itemid.toString());
}
 });

 router.route('/item/:itemid/remove').post(async (req, res) => {
   const itemId = req.params.itemid;
   try {
     const removed = await itemCommands.removeItem(itemId.toString());
     if (!removed) throw 'Item could not be deleted';
     return res.redirect('/items');
   } catch (e) {
     return res.status(404).json({ error: e });
   }
 });

router.route('/item/edit/:itemid').get(async (req, res) => {
    const item = await itemCommands.getItemByID(req.params.itemid)
     return res.render('editItem', {title: "CampusExchange", itemInfo: item});
});
 router.route('/item/edit/:itemid').post(async (req, res) => {
  try {
  const item = await itemCommands.getItemByID(req.params.itemid)
  const itemID = req.params.itemid;
  if(req.session.user._id=== item.ownerId.toString()){
    const name= req.body.name;
    const description= req.body.description;
    console.log(itemID+ name+ description);
    const itemUpdated= await itemCommands.updateItem(itemID, name, description);
    return res.redirect('/item/'+ itemID.toString());
  }
} catch(e){
  console.log(e);
   return res.redirect('/item/' + req.params.itemid.toString());
}
 });



router.route('/items/search/:query').get(async (req, res) => {
  try {
    let filteredItems = await itemCommands.searchItems(req.session.user._id, req.session.user.school, req.params.query);
    if (filteredItems.length == 0) {
      return res.render('items', { title: "School Items", items: filteredItems, user: req.session.user, search_error: "No items found!" })
    }
    return res.render('items', { title: "School Items", items: filteredItems, user: req.session.user })
  }
  catch (e) {
    console.log(e)
    return res.redirect('/items');
  }
})

export default router;