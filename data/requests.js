import { ObjectId } from 'mongodb';
import { items, users, requests } from '../config/mongoCollections.js';
import itemFunctions from './items.js'
import userFunctions from './users.js'

const createRequest = async (
    LenderID,
    BorrowerID,
    ItemID,
    BorrowerDescription,

) => {
    if (!LenderID || !BorrowerID || !ItemID || !BorrowerDescription) {
        throw 'Error: All fields need to have valid values';
    }

    if (typeof LenderID != "string") {
        throw 'Error: LenderID must be of type string';
    }
    LenderID = LenderID.trim()
    if (!ObjectId.isValid(LenderID)) {
        throw 'Error: LenderID must be a valid ObjectId'
    }
    try {
        await userFunctions.getUserByID(LenderID);
    }
    catch (e) {
        throw e
    }

    if (typeof BorrowerID != "string") {
        throw 'Error: BorrowerID must be of type string';
    }
    BorrowerID = BorrowerID.trim()
    if (!ObjectId.isValid(BorrowerID)) {
        throw 'Error: BorrowerID must be a valid ObjectId'
    }
    try {
        await userFunctions.getUserByID(BorrowerID);
    }
    catch (e) {
        throw 'Error: BorrowerID not found in database'
    }

    if (typeof ItemID != "string") {
        throw 'Error: ItemID must be of type string';
    }
    ItemID = ItemID.trim()
    if (!ObjectId.isValid(ItemID)) {
        throw 'Error: ItemID must be a valid ObjectId'
    }
    try {
        let item=await itemFunctions.getItemByID(ItemID);
    }
    catch (e) {
        throw 'Error: ItemID not found in database'
    }

    let item = await itemFunctions.getItemByID(ItemID);
    if (item.ownerId != LenderID) {
        throw 'Error: item owner id and lender id do not match'
    }

    if(!item.availability){
        throw 'Error: item not available currently'
    }
    
    if (typeof BorrowerDescription != "string") {
        throw 'Error: Borrower description must be of type string';
    }
    BorrowerDescription = BorrowerDescription.trim()

    const requestsCollection = await requests();
    let duplicate_requests = await requestsCollection.find({
        LenderID: LenderID,
        BorrowerID: BorrowerID,
        ItemID: ItemID,
        Status: "Pending"
    }).toArray();
    let accepted_duplicate_requests= await requestsCollection.find({
        LenderID: LenderID,
        BorrowerID: BorrowerID,
        ItemID: ItemID,
        Status: "Accepted"
    }).toArray();
    duplicate_requests=duplicate_requests.concat(accepted_duplicate_requests)
    if (duplicate_requests.length != 0) {
        throw "Error: you already made a request for this item!"
    }
    const newRequest = {
        LenderID: LenderID,
        BorrowerID: BorrowerID,
        Date: new Date().toLocaleString(),
        ItemID: ItemID,
        Status: "Pending",
        BorrowerDescription: BorrowerDescription
    }

    const insertInfo = await requestsCollection.insertOne(newRequest);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Error: Could not add request'; }

    return insertInfo.insertedId;
};

const getRequestByID = async (requestID) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    const requestCollection = await requests();
    const request = await requestCollection.findOne({ _id: new ObjectId(requestID) })
    if (!request) {
        throw "No request with that ID"
    }

    request._id = request._id.toString();

    return request;
}
const acceptRequest = async (requestID) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    try {
        await getRequestByID(requestID);
    }
    catch (e) {
        throw 'Error: requestID not found in database'
    }

    let request = await getRequestByID(requestID);
    if (request.Status != "Pending") {
        throw "Error: status must be Pending before accepting a request"
    }
    const itemsCollection = await items();
    const item = await itemsCollection.findOne({ _id: new ObjectId(request.ItemID) })
    if ((!item.CurrentRequest) == false) {
        throw "Error: item is already actively being borrowed"
    }

    const requestsCollection = await requests();

    const updateInfo = await requestsCollection.updateOne({ _id: new ObjectId(requestID) }, { $set: { Status: "Accepted" } })
    if (!updateInfo.acknowledged) { throw 'Error: Could not update request'; }

    const usersCollection = await users();
    const userUpdateInfo = await usersCollection.updateOne({ _id: new ObjectId(request.BorrowerID) }, { $push: { borrowedItems: request.ItemID } });
    if (!userUpdateInfo.acknowledged) { throw 'Error: Could not update user'; }
    const userUpdateInfo2 = await usersCollection.updateOne({ _id: new ObjectId(request.LenderID) }, { $push: { loanedItems: request.ItemID } });
    if (!userUpdateInfo2.acknowledged) { throw 'Error: Could not update user'; }

    const itemInfo = await itemsCollection.updateOne({ _id: new ObjectId(request.ItemID) }, { $set: { CurrentRequest: requestID } });
    if (!itemInfo.acknowledged) { throw 'Error: Could not update item'; }
    return requestID
};

const completeRequest = async (requestID) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    try {
        await getRequestByID(requestID);
    }
    catch (e) {
        throw 'Error: requestID not found in database'
    }

    let request = await getRequestByID(requestID);
    if (request.Status != "Accepted") {
        throw "Error: status must be Accepted before completing a request"
    }

    const requestsCollection = await requests();

    const updateInfo = await requestsCollection.updateOne({ _id: new ObjectId(requestID) }, { $set: { Status: "Completed" } })
    if (!updateInfo.acknowledged) { throw 'Error: Could not update request'; }

    const itemsCollection = await items();
    const itemInfo = await itemsCollection.updateOne({ _id: new ObjectId(request.ItemID) }, { $set: { CurrentRequest: null } });
    if (!itemInfo.acknowledged) { throw 'Error: Could not update item'; }

    const historyUpdateInfo = await itemsCollection.updateOne({ _id: new ObjectId(request.ItemID) }, { $push: { history: requestID } });
    if (!historyUpdateInfo.acknowledged) { throw 'Error: Could not update history'; }

    const usersCollection = await users();

    const removeFromLoaner = await usersCollection.updateOne({ _id: new ObjectId(request.LenderID) }, { $pull: { loanedItems: request.ItemID } });
    if (!removeFromLoaner.acknowledged) { throw 'Error: Could not update user'; }

    const removeFromBorrower = await usersCollection.updateOne({ _id: new ObjectId(request.BorrowerID) }, { $pull: { borrowedItems: request.ItemID } });
    if (!removeFromBorrower.acknowledged) { throw 'Error: Could not update user'; }
};

const rejectRequest = async (requestID) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    try {
        await getRequestByID(requestID);
    }
    catch (e) {
        throw 'Error: requestID not found in database'
    }

    let request = await getRequestByID(requestID);
    if (request.Status != "Pending") {
        throw "Error: status must be Pending before rejecting a request"
    }

    const requestsCollection = await requests();

    const updateInfo = await requestsCollection.updateOne({ _id: new ObjectId(requestID) }, { $set: { Status: "Rejected" } })
    if (!updateInfo.acknowledged) { throw 'Error: Could not update request'; }

    const usersCollection = await users();
    const userUpdateInfo = await usersCollection.updateOne({ _id: new ObjectId(request.BorrowerID) }, { $pull: { borrowedItems: request.ItemID } });
    const userUpdateInfo2 = await usersCollection.updateOne({ _id: new ObjectId(request.BorrowerID) }, { $pull: { loanedItems: request.ItemID } });
    if (!userUpdateInfo.acknowledged) { throw 'Error: Could not update user'; }
    if (!userUpdateInfo2.acknowledged) { throw 'Error: Could not update user'; }
}

const getRequestLenderId = async (requestID) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    try {
        await getRequestByID(requestID);
    }
    catch (e) {
        throw 'Error: requestID not found in database'
    }
    let request = await getRequestByID(requestID);
    return request.LenderID.toString()

}
const getRequestBorrowerId = async (requestID) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    try {
        await getRequestByID(requestID);
    }
    catch (e) {
        throw 'Error: requestID not found in database'
    }
    let request = await getRequestByID(requestID);
    return request.BorrowerID.toString()

}

const updateRequestKarma = async (requestID, givenRating, userId) => {
    if (!requestID) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof requestID != "string") {
        throw 'Error: request ID must be a string'
    }
    requestID = requestID.trim();

    if (!ObjectId.isValid(requestID)) {
        throw 'Error: requestID must be a valid ObjectId'
    }

    try {
        await getRequestByID(requestID);
    }
    catch (e) {
        throw 'Error: requestID not found in database'
    }
    if (isNaN(givenRating)) {
        throw 'Error: givenRating must be a number'
    }
    if (givenRating < 1 || givenRating > 10) {
        throw 'Error: givenRating must be a number 1-10'
    }
    
    if(!userId){
        throw "Error: userId not given";
    }
    if(typeof userId!="string"){
        throw "Error: userId must be string";
    }
    if (!ObjectId.isValid(userId)) {
        throw 'Error: userID must be a valid ObjectId'
    }

    const requestsCollection = await requests();
    let request=await getRequestByID(requestID);

    let userBeingRated;
    let role;
    if(userId==request.LenderID){
        role="lender";
        userBeingRated=request.BorrowerID;
    }
    else if(userId==request.BorrowerID){
        role="borrower";
        userBeingRated=request.LenderID
    }
    if(!role){
        throw "Error: user is not involved in this transaction!";
    }

    const updateRating = await requestsCollection.updateOne({ _id: new ObjectId(requestID) }, { $set: { ['scoreSubmitted.'+userId]: givenRating } });
    if (!updateRating.acknowledged) { throw 'Error: Could not update transaction score'; }

    await userFunctions.updateKarma(userBeingRated, givenRating);

    let output={}
    output.userBeingRated=userBeingRated
    output.userGivingRating=userId
    output.score=givenRating
    return output

}

const getAllRequests = async () => {
    //just for testing
    const RequestCollection = await requests();
    const allRequests = await RequestCollection.find({}).toArray();
    return allRequests;
}

const getLeaderboard = async () => {
    const userCollection = await users();
    const topUsers = await userCollection.find().sort({ karma: -1 }).limit(10).toArray();
    return topUsers;
}

const getUnfinishedRequestsWithUserID = async (userId) => {
    if (!userId) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof userId != "string") {
        throw 'Error: userId must be a string'
    }
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) {
        throw 'Error: userId must be a valid ObjectId'
    }

    try {
        const requestCollection = await requests();
        const userRequests = await requestCollection.find({ $and: [ { $or:[{BorrowerID:userId},{LenderID:userId}]}, {[`scoreSubmitted.${userId}`]: {$exists:false}}, {Status:"Completed"} ] }).toArray();
        return userRequests
    } catch (e) {
        throw e.toString()
    }
}

const getIncomingPendingRequests= async (userId) => {
    if (!userId) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof userId != "string") {
        throw 'Error: userId must be a string'
    }
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) {
        throw 'Error: userId must be a valid ObjectId'
    }
    const requestCollection = await requests();
    const incomingRequests = await requestCollection.find({LenderID:userId, Status: "Pending"}).toArray();
    return incomingRequests;

}

const getOutgoingPendingRequests= async (userId) => {
    if (!userId) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof userId != "string") {
        throw 'Error: userId must be a string'
    }
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) {
        throw 'Error: userId must be a valid ObjectId'
    }
    const requestCollection = await requests();
    const outgoingRequests = await requestCollection.find({BorrowerID:userId, Status: "Pending"}).toArray();
    return outgoingRequests;

}

const getIncomingAcceptedRequests= async (userId) => {
    if (!userId) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof userId != "string") {
        throw 'Error: userId must be a string'
    }
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) {
        throw 'Error: userId must be a valid ObjectId'
    }
    const requestCollection = await requests();
    const incomingRequests = await requestCollection.find({LenderID:userId, Status: "Accepted"}).toArray();
    return incomingRequests;

}

const getOutgoingAcceptedRequests= async (userId) => {
    if (!userId) {
        throw 'Error: All fields need to have valid values';
    }
    if (typeof userId != "string") {
        throw 'Error: userId must be a string'
    }
    userId = userId.trim();
    if (!ObjectId.isValid(userId)) {
        throw 'Error: userId must be a valid ObjectId'
    }
    const requestCollection = await requests();
    const outgoingRequests = await requestCollection.find({BorrowerID:userId, Status: "Accepted"}).toArray();
    return outgoingRequests;

}



export default { getUnfinishedRequestsWithUserID, getLeaderboard, createRequest, getRequestByID, acceptRequest, completeRequest, rejectRequest, getRequestLenderId, getRequestBorrowerId, updateRequestKarma, getAllRequests, getIncomingPendingRequests, getOutgoingPendingRequests, getIncomingAcceptedRequests, getOutgoingAcceptedRequests };