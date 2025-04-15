import { items, users, requests } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from "bcryptjs";
// import schoolIDs from './world_universities_and_domains.json' assert { type: 'json' };

const registerUser = async (
    name,
    email,
    school,
    password
) => {
    if (!name || !email || !school || !password)
        throw 'Error: All fields need to have valid values';

    if (typeof name !== 'string' && typeof email !== 'string' && typeof school !== 'string' && typeof password !== 'string') {
        throw 'Error: One of the properties is of incorrect type and must be a string';
    }
    name = name.trim()
    email = email.trim().toLowerCase()
    school = school.trim()
    password = password.trim()
    if (name.length === 0 || email.length === 0 || school.length === 0 || password.length === 0){
        throw 'Error: One of the properties is invalid and cannot be an empty string or just spaces';
    }
    if(email.indexOf('@') === -1){
        throw 'Error Invalid Email'
    }
    const userSchoolEmail = email.slice(email.indexOf('@'))
    let verified =false
    // for(let i = 0; i < schoolIDs.length; i++){
    //     let domains = schoolIDs[i]['domains']
    //     for (let domain of domains){
    //         if(userSchoolEmail === domain){
    //             verified = true
    //             break
    //         }
    //     }
    //     if(verified){
    //         break
    //     }
    // }

    const userCollection = await users();
    const emailExists = await userCollection.findOne({ email: email });
    if (emailExists) throw 'Error: this email has already been taken.';


    const saltRounds = 3;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    const newUser = {
        Name: name,
        email: email,
        school: school,
        password: password,
        verified: verified,
        ownedItems: [],
        borrowedItems: [],
        wishlist: [],
        karma: 0,

    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Error: Could not add User'; }
    else { registered: true };
};

const userLogin = async (email, password) => {
    //TODO
};

export default { registerUser, userLogin }