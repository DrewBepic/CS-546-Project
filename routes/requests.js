import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'

router.route('/request/item/:itemId').get(async (req, res) => {
  try {
    let item = await itemCommands.getItemByID(req.params.itemId);
    let itemOwner = await userCommands.getUserByID(item.ownerId)
    item.owner = itemOwner.name
    return res.render('requestItem', { user: req.session.user, itemInfo: item, title: "Request Item" })
  }
  catch (e) {
    console.log(e);
    return res.redirect("/items");
  }
})
  .post(async (req, res) => {
    let requestId;
    try {
      let item = await itemCommands.getItemByID(req.params.itemId);
      requestId = await requestCommands.createRequest(item.ownerId, req.session.user._id, req.params.itemId, req.body.description);
      return res.redirect('/request/' + requestId);
    }
    catch (e) {
        if(!requestId){
            return res.render('error',{error:e,user:req.session.user,title:"Error"})
        }
        return res.redirect('/request/' + requestId,{error:e,user:req.session.user});
    }
  });

router.route('/request/:requestId').get(async (req, res) => {
  try {
    let request = await requestCommands.getRequestByID(req.params.requestId);
    let item = await itemCommands.getItemByID(request.ItemID);
    let lender = await userCommands.getUserByID(request.LenderID);
    let borrower = await userCommands.getUserByID(request.BorrowerID);
    let isLender = false;
    let isBorrower = false;
    let isAccepted = false;
    let isPending = false;
    let isRejected = false;
    if (req.session.user._id == lender._id) {
      isLender = true;
    }
    if (req.session.user._id == borrower._id) {
      isBorrower = true;
    }
    if (request.Status == "Accepted") {
      isAccepted = true;
    }
    if (request.Status == "Pending") {
      isPending = true;
    }
    if (request.Status == "Rejected") {
      isRejected = true;
    }
    return res.render('request', { user: req.session.user, request: request, item: item, lender: lender, borrower: borrower, isLender, isBorrower, isAccepted, isPending, isRejected,title:"Request" })
  }
  catch (e) {
    console.log(e);
    return res.redirect("/items");
  }
})

router.route('/request/:requestId/accept').post(async (req, res) => {
  try {
    let request = await requestCommands.getRequestByID(req.params.requestId);
    if (request.LenderID != req.session.user._id) {
      throw "Error: you are not allowed to accept this request!"
    }
    await requestCommands.acceptRequest(req.params.requestId);
    return res.redirect('/request/' + req.params.requestId)
  }
  catch (e) {
    return res.render('error', { user: req.session.user, error: e,title:"Error" })
  }
})

router.route('/request/:requestId/reject').post(async (req, res) => {
  try {
    let request = await requestCommands.getRequestByID(req.params.requestId);
    if (request.LenderID != req.session.user._id) {
      throw "Error: you are not allowed to reject this request!"
    }
    await requestCommands.rejectRequest(req.params.requestId);
    return res.redirect('/request/' + req.params.requestId)
  }
  catch (e) {
    return res.render('error', { user: req.session.user, error: e, title: "Error"})
  }
})

router.route('/request/:requestId/complete').post(async (req, res) => {
  try {
    let request = await requestCommands.getRequestByID(req.params.requestId);
    if (request.LenderID != req.session.user._id) {
      throw "Error: you are not allowed to complete this request!"
    }
    await requestCommands.completeRequest(req.params.requestId);
    return res.redirect('/ratingRequests')
  }
  catch (e) {
    return res.render('error', { user: req.session.user, error: e, title:"Error"})
  }
})

router.route('/leaderboard').get(async (req, res) => {
  try {
    const topUsers = await requestCommands.getLeaderboard();
    return res.render('leaderboard', { user: req.session.user, topUsers: topUsers, title: "Leaderboard" })
  } catch (e) {
    return res.redirect("/ratingRequests");
  }
})

router.route('/ratingRequests').get(async (req, res) => {
  try {
    const unfinished = await requestCommands.getUnfinishedRequestsWithUserID(req.session.user._id.toString())
    for (let i = 0; i < unfinished.length; i++) {
      let item = await itemCommands.getItemByID(unfinished[i].ItemID)
      unfinished[i]["itemName"] = item.name
      let user = await userCommands.getUserByID(unfinished[i].BorrowerID)
      unfinished[i]["borrower"] = user.name
      let lender = await userCommands.getUserByID(unfinished[i].LenderID)
      unfinished[i]["lender"] = lender.name
    }
    return res.render('karmaRequests', { user: req.session.user, unfinished: unfinished, title: "Give Karma"})
  } catch (e) {
    return res.redirect("/items");
  }
})
  .post(async (req, res) => {
    try {
      if (!req.body.rating) {
        throw "Invalid input"
      }
      let input = Number(req.body.rating);

      // Check if it's a valid number
      if (typeof input !== 'number' || isNaN(input)) {
        throw "Not a number";
      }
      if (!Number.isInteger(input)) {
        throw "Not a whole number"
      }
      if (input > 10 || input < 1) {
        throw "Must be a number from 1-10"
      }
      const requestId = req.body.requestId
      let update_request_results=await requestCommands.updateRequestKarma(requestId, input, req.session.user._id)
      await userCommands.updateKarma(update_request_results.userBeingRated, input)
      return res.redirect('ratingRequests')

    } catch (e) {
      console.log(e)
      return res.status(404).redirect('ratingRequests')
    }
  });


export default router;