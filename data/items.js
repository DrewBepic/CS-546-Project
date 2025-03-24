import {items} from '../config/mongoCollections.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const addItem = async (userId, name, description) => {
    const itemCollection = await items();

    let newItem = {
        _id: new ObjectId(userId),
        name: name,
        description: description
    };

    const insertInfo = await itemCollection.insertOne(newItem);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add item';
    const newId = insertInfo.insertedId.toString();
    };