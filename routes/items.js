import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'
import xss from 'xss';

router.route('/items').get(async (req, res) => {
  let items = await itemCommands.getItemsBySchool(req.session.user._id, req.session.user.school);
  let itemsToStart=true;
  if (items.length == 0) {
    items = null;
    itemsToStart=false
  }
  return res.render('items', { user: req.session.user, title: "School Items", items: items,itemsToStart:itemsToStart })
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

      const safeName = xss(body.name);
      const safeDescription = xss(body.description);
      const availability = body.availability === 'on';

      if (!safeName|| !safeDescription){
        throw 'Please fill out all fields.'
      }

      const newItem = await itemCommands.addItem(req.session.user._id, safeName, safeDescription, availability)
      const newItemID = newItem._id
      return res.redirect('/item/' + newItem);
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

    let request_history=[];
    if(item.history){
        for(let requestID in item.history){
            let request_obj=await requestCommands.getRequestByID(item.history[requestID])
            let borrower=await userCommands.getUserByID(request_obj.BorrowerID)
            request_obj.Date=request_obj.Date.split(",")[0]
            request_obj.borrowerName=borrower.name
            request_history.push(request_obj);
        }
        item.history=request_history
    }
    return res.render('item', { hasErrors: false, title: "CampusExchange", itemInfo: item, ownerName: ownerName, user: req.session.user, owner: owner, inWL: inWL});
  } catch (e) {
    console.log(e);
    return res.render('item', { hasErrors: true, title: "CampusExchange", error: e, user: req.session.user });
  }
})
.post(async (req, res) => {
  try {
    console.log("post route here");
    const safeComment = xss(req.body.comment);
    const itemID = req.params.itemid;

    if (!safeComment){
        throw 'Please fill out all fields.'
      }

    const user = await userCommands.getUserByID(req.session.user._id.toString());
    const commentAdd = await itemCommands.addComment(user.name,itemID, safeComment)
    if (!commentAdd) {
      throw "Could not add comment"
    }
    return res.redirect('/item/' + itemID.toString());
  } catch (e) {
    console.log(e);
    return res.redirect('/item/' + req.params.itemid.toString());
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
     return res.render('error',{title:"Error",user:req.session.user,error:e});
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
    const safeName= xss(req.body.name);
    const safeDescription= xss(req.body.description);

    if (!safeName || !safeDescription){
      throw 'Please fill out all fields.'
    }


    const itemUpdated= await itemCommands.updateItem(itemID, safeName, safeDescription);
    return res.redirect('/item/'+ itemID.toString());
  }
} catch(e){
    return res.render('error', {title: "Error", error:e});
}
 });



// router.route('/items/search/:query').get(async (req, res) => {
//   try {
//     const query = req.params.query;
//     const safeQuery = xss(query);
//     let filteredItems = await itemCommands.searchItems(req.session.user._id, req.session.user.school, safeQuery);
//     if (filteredItems.length == 0) {
//       return res.render('items', { title: "School Items", items: filteredItems, user: req.session.user, search_error: "No items found!" })
//     }
//     return res.render('items', { title: "School Items", items: filteredItems, user: req.session.user })
//   }
//   catch (e) {
//     return res.redirect('/items');
//   }
// })

router.route('/items/search').post(async (req, res) => {
    try{
        req.body.item_search=xss(req.body.item_search)
        let filteredItems = await itemCommands.searchItems(req.session.user._id, req.session.user.school, req.body.item_search);
        res.json(filteredItems)
    }
    catch(e){
        console.log(e);
        return res.render('items', { title: "School Items", user: req.session.user, search_error: "Server Error Encountered" })
    }
})
export default router;