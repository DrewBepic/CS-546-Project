import { items, users, requests } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

//TEST

const addItem = async (userId, name, description) => {
    if (!ObjectId.isValid(userId)) throw 'Invalid ObjectId';
    const itemCollection = await items();
    if (!name || !description) throw 'Error: Name and Description must be filled out';
    if (typeof name !== 'string' || typeof description !== 'string') throw 'Error: Name and Description must be strings';
    if (name.trim().length === 0 || description.trim().length === 0) throw 'Error: Name and Description cannot be empty strings';
    name = name.trim();
    description = description.trim();
    let history = [];
    let requests = [];
    let comments = [];
    let newItem = {
        name: name,
        ownerId: userId, //matching to database so making it ownerId
        description: description,
        history: history,
        requests: requests,
        comments: comments
    };

    const insertInfo = await itemCollection.insertOne(newItem);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add item';

    const userCollection = await users();
    const addUserItem = await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { ownedItems:{
            _id: insertInfo.insertedId,
            name: name,
            description: description
            }      
        } 
        }
    );

    if (!addUserItem) {
        throw 'Could not add User item successfully';
    }
};

const removeItem = async (id) => {
    if (!id) throw 'An Id must be provided';
    if (typeof id !== 'string') throw 'Provided Id must be a string';
    if (id.trim().length === 0)
        throw 'Provided Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const itemCollection = await items();
    const itemToDelete = await itemCollection.findOne({ _id: new ObjectId(id) });
    if (!itemToDelete) throw 'Item not found';
    const deletedItem = await itemCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!deletedItem) throw `Could not delete item with provided Id`;
    const userCollection = await users();
    const removeItem = await userCollection.updateOne(
        { _id: new ObjectId(itemToDelete.ownerId) },
        { $pull: { ownedItems: { _id: new ObjectId(id)  } } },
        { returnDocument: 'after' }
    ); 

    if (!removeItem) {
        throw 'Could not remove item successfully';
    }
};

const updateItem = async (itemId, name, description) => {
    if (!ObjectId.isValid(itemId)) throw 'Invalid ObjectId';
    const itemCollection = await items();
    if (!name || !description) throw 'Error: Name and Description must be filled out';
    if (typeof name !== 'string' || typeof description !== 'string') throw 'Error: Name and Description must be strings';
    if (name.trim().length === 0 || description.trim().length === 0) throw 'Error: Name and Description cannot be empty strings';
    name = name.trim();
    description = description.trim();

    let updateItem = {
        name: name,
        description: description,
    };

    const updateInfo = await itemCollection.findOneAndUpdate(
        { _id: new ObjectId(itemId) },
        { $set: updateItem },
        { returnDocument: 'after' });

    if (!updateInfo) {
        throw 'Could not update item successfully';
    }

    const userCollection = await users();
    const ownerId = updateInfo.value.ownerId;

    const updateUserInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(ownerId) },
        { $set: {ownedItems: updateItem} },
        { returnDocument: 'after' });

    if (!updateUserInfo) {
        throw 'Could not update User item successfully';
    }

    updateInfo._id = updateInfo._id.toString();
};

const getAllItems = async () => {
    const itemCollection = await items();
    const allItems = await itemCollection.find({}).toArray();
    return allItems
}

const getItemByID = async (id) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId';
    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: new ObjectId(id) })
    if (!item) {
        throw "No item with specified id"
    }
    item._id = item._id.toString()
    return item
}

const addComment = async (id, comment) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId';
    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });
    if (!item) {
        throw "No item with specified id";
    }
    const updateResult = await itemCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: comment.trim() } }
    );
    if (updateResult.modifiedCount === 0) {
        throw "Failed to add comment";
    }
    return updateResult;
}
export default { updateItem, addItem, removeItem, getAllItems, getItemByID, addComment };