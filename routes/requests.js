import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'
import requestCommands from '../data/requests.js'

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
      let isRejected=false;
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
      if(request.Status=="Rejected"){
        isRejected=true;
      }
      return res.render('request',{user:req.session.user,request:request,item:item,lender:lender,borrower:borrower,isLender,isBorrower,isAccepted,isPending,isRejected})
    }
    catch (e){
      console.log(e);
      return res.redirect("/items");
    }
  })

  router.route('/request/:requestId/accept').post(async (req,res) => {
    try{
        let request=await requestCommands.getRequestByID(req.params.requestId);
        if(request.LenderID!=req.session.user._id){
            throw "Error: you are not allowed to accept this request!"
        }
        await requestCommands.acceptRequest(req.params.requestId);
        return res.redirect('/request/'+req.params.requestId)
    }
    catch (e){
        return res.render('error',{user:req.session.user,error:e})
    }
  })

  router.route('/request/:requestId/reject').post(async (req,res) => {
    try{
        let request=await requestCommands.getRequestByID(req.params.requestId);
        if(request.LenderID!=req.session.user._id){
            throw "Error: you are not allowed to reject this request!"
        }
        await requestCommands.rejectRequest(req.params.requestId);
        return res.redirect('/request/'+req.params.requestId)
    }
    catch (e){
        return res.render('error',{user:req.session.user,error:e})
    }
  })

  router.route('/request/:requestId/complete').post(async (req,res) => {
    try{
        let request=await requestCommands.getRequestByID(req.params.requestId);
        if(request.LenderID!=req.session.user._id){
            throw "Error: you are not allowed to complete this request!"
        }
        await requestCommands.completeRequest(req.params.requestId);
        return res.render('submitKarma',{user:req.session.user})
    }
    catch (e){
        return res.render('error',{user:req.session.user,error:e})
    }
  })

export default router;