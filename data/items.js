import {items} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

//TEST

export const addItem = async (userId, name, description) => {
    if (!ObjectId.isValid(userId)) throw 'Invalid ObjectId';
    const itemCollection = await items();
    if (!name || !description) throw 'Error: Name and Description must be filled out';
    if (typeof name !== 'string' || typeof description !== 'string') throw 'Error: Name and Description must be strings';
    if (name.trim().length === 0 || description.trim().length === 0) throw 'Error: Name and Description cannot be empty strings';
    name = name.trim();
    description = description.trim();

    let newItem = {
        _id: new ObjectId(userId),
        name: name,
        description: description,
        status: ""
    };

    const insertInfo = await itemCollection.insertOne(newItem);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add item';
    const newId = insertInfo.insertedId.toString();
    };

export const removeItem = async (id) => {
        if (!id) throw 'An Id must be provided';
        if (typeof id !== 'string') throw 'Provided Id must be a string';
        if (id.trim().length === 0)
            throw 'Provided Id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'invalid object ID';
        const itemCollection = await items();
        const deletedItem = await itemCollection.findOneAndDelete({_id: new ObjectId(id)});
        if (!deletedItem){
            throw `Could not delete item with provided Id`;
        }
    };

export const updateItem = async (userId, name, description) => {
    if (!ObjectId.isValid(userId)) throw 'Invalid ObjectId';
    const itemCollection = await items();
    if (!name || !description) throw 'Error: Name and Description must be filled out';
    if (typeof name !== 'string' || typeof description !== 'string') throw 'Error: Name and Description must be strings';
    if (name.trim().length === 0 || description.trim().length === 0) throw 'Error: Name and Description cannot be empty strings';
    name = name.trim();
    description = description.trim();

    let updateItem = {
        name: name,
        description: description,
        //status: ""
    };

    const updateInfo = await itemCollection.findOneAndUpdate(
        {_id: new ObjectId(userId)},
        {$set: updateItem},
        {returnDocument: 'after'});

    if (!updateInfo) {
        throw 'Could not update item successfully';
    } 

    updatedInfo._id = updatedInfo._id.toString();
};