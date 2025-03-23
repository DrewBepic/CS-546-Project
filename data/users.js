import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const registerUser = async (
    firstName,
    lastName,
    email,
    password,
    university
) => {

    //Check that all of the properties are provided
    if (!firstName || !lastName || !email || !rating || !password || !university) 
        throw 'Error: All fields need to have valid values';
    
    //Check that all properties are strings
    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof university !== 'string')
        throw 'Error: One of the properties is of incorrect type and must be a string';
    
    //Check that all properties are not empty strings
    if (firstName.trim().length === 0 || lastName.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || university.trim().length === 0)
        throw 'Error: One of the properties is invalid and cannot be an empty string or just spaces';  

    //Trim all of the properties other than password
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    university = university.trim();

    //Check if the email already exists in the database
    const userCollection = await users();
    const emailExists = await userCollection.findOne({  email: email });
    if (emailExists) throw 'Error: this email has already been taken.';

    //Create new User (FIGURE OUT HOW TO WORK WITH PASSWORD (HASHING??????))
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        university: university
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId){ throw 'Error: Could not add User';}
    else { registered: true };
    };

    export const userLogin = async (email, password) => {
        //TODO
    };