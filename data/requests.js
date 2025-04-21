import { ObjectId } from 'mongodb';
import {items, users, requests} from '../config/mongoCollections.js';
import itemFunctions from './items.js'
import userFunctions from './users.js'

const createRequest = async (
    LenderID,
    BorrowerID,
    ItemID,
    BorrowerDescription,

) => {
    if(!LenderID || !BorrowerID || !ItemID || !BorrowerDescription){
        throw 'Error: All fields need to have valid values';
    }

    if(typeof LenderID!="string"){
        throw 'Error: LenderID must be of type string';
    }
    LenderID=LenderID.trim()
    if(!ObjectId.isValid(LenderID)){
        throw 'Error: LenderID must be a valid ObjectId'
    }
    try{
        await userFunctions.getUserByID(LenderID);
    }
    catch (e){
        throw e
    }

    if(typeof BorrowerID!="string"){
        throw 'Error: BorrowerID must be of type string';
    }
    BorrowerID=BorrowerID.trim()
    if(!ObjectId.isValid(BorrowerID)){
        throw 'Error: BorrowerID must be a valid ObjectId'
    }
    try{
        await userFunctions.getUserByID(BorrowerID);
    }
    catch (e){
        throw 'Error: BorrowerID not found in database'
    }

    if(typeof ItemID!="string"){
        throw 'Error: ItemID must be of type string';
    }
    ItemID=ItemID.trim()
    if(!ObjectId.isValid(ItemID)){
        throw 'Error: ItemID must be a valid ObjectId'
    }
    try{
        await itemFunctions.getItemByID(ItemID);
    }
    catch (e){
        throw 'Error: ItemID not found in database'
    }

    let item=await itemFunctions.getItemByID(ItemID);
    if(item.ownerId!=LenderID){
        throw 'Error: item owner id and lender id do not match'
    }

    if(typeof BorrowerDescription!="string"){
        throw 'Error: Borrower description must be of type string';
    }
    BorrowerDescription=BorrowerDescription.trim()

    const requestsCollection = await requests();
    let duplicate_requests= await requestsCollection.find({
        LenderID: LenderID,
        BorrowerID: BorrowerID,
        ItemID: ItemID,
        Status: "Pending"
    }).toArray();
    if(duplicate_requests.length!=0){
        throw "Error: a pending request has already been made for this item"
    }
    const newRequest = {
        LenderID: LenderID,
        BorrowerID: BorrowerID,
        Date: new Date().toLocaleString,
        ItemID: ItemID,
        Status: "Pending",
        BorrowerDescription: BorrowerDescription,
        TransactionScores: null
    }

    const insertInfo = await requestsCollection.insertOne(newRequest);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Error: Could not add request'; }

    return insertInfo.insertedId;
};

const getRequestByID = async (requestID) => 
{
    if(!requestID){
        throw 'Error: All fields need to have valid values';
    }
    if(typeof requestID!="string"){
        throw 'Error: request ID must be a string'
    }
    requestID=requestID.trim();

    if(!ObjectId.isValid(requestID)){
        throw 'Error: requestID must be a valid ObjectId'
    }

    const requestCollection = await requests();
    const request = await requestCollection.findOne({_id: new ObjectId(requestID)})
    if(!request){
        throw "No request with that ID"
    }

    request._id=request._id.toString();

    return request;
}
const acceptRequest = async (requestID) => 
    {
        if(!requestID){
            throw 'Error: All fields need to have valid values';
        }
        if(typeof requestID!="string"){
            throw 'Error: request ID must be a string'
        }
        requestID=requestID.trim();

        if(!ObjectId.isValid(requestID)){
            throw 'Error: requestID must be a valid ObjectId'
        }

        try{
            await getRequestByID(requestID);
        }
        catch (e){
            throw 'Error: requestID not found in database'
        }

        let request=await getRequestByID(requestID);
        if(request.Status!="Pending"){
            throw "Error: status must be Pending before accepting a request"
        }
        const requestsCollection = await requests();

        const updateInfo = await requestsCollection.updateOne({_id:new ObjectId(requestID)},{$set:{Status:"Accepted"}})
        if (!updateInfo.acknowledged) { throw 'Error: Could not update request'; }
    };

const completeRequest = async (requestID) => 
    {
        if(!requestID){
            throw 'Error: All fields need to have valid values';
        }
        if(typeof requestID!="string"){
            throw 'Error: request ID must be a string'
        }
        requestID=requestID.trim();

        if(!ObjectId.isValid(requestID)){
            throw 'Error: requestID must be a valid ObjectId'
        }

        try{
            await getRequestByID(requestID);
        }
        catch (e){
            throw 'Error: requestID not found in database'
        }

        let request=await getRequestByID(requestID);
        if(request.Status!="Accepted"){
            throw "Error: status must be Accepted before completing a request"
        }

        const requestsCollection = await requests();

        const updateInfo = await requestsCollection.updateOne({_id:new ObjectId(requestID)},{$set:{Status:"Completed"}})
        if (!updateInfo.acknowledged) { throw 'Error: Could not update request'; }
    };

export default {createRequest,getRequestByID,acceptRequest,completeRequest};