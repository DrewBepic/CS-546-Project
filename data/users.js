import { items, users, requests } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import validator from 'validator';
// import schoolIDs from './world_universities_and_domains.json' assert { type: 'json' };

async function getSchools(){
    const { data } = await axios.get('https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json')
    return data
}

const registerUser = async (
    name,
    email,
    password,
    passConfirm
) => {
    if (!name || !email || !password || !passConfirm)
        throw 'Error: All fields need to have valid values';

    if (typeof name !== 'string' && typeof email !== 'string' && typeof password !== 'string' && typeof passConfirm !== 'string') {
        throw 'Error: One of the properties is of incorrect type and must be a string';
    }
    name = name.trim()
    email = email.trim().toLowerCase()
    if (name.length === 0 || email.length === 0 || password.length === 0 || passConfirm.length === 0){
        throw 'Error: One of the properties is invalid and cannot be an empty string or just spaces';
    }
    if(passConfirm !== password){
        throw "Error: Passwords do not match"
    }
    let str= password.trim();
    let lower= str.toLocaleLowerCase();
    let upper = str.toLocaleUpperCase();
    let lowercase= 0;
    let uppercase= 0;
    let numbers= 0;
    let spaces= 0;
    let otherCharacters= 0;
    let i = 0; 
      while (i < str.length) {
        if (str[i]===" "){
          spaces++;
        }
        else if (str[i] >= '0' && str[i] <= '9') {
          numbers++;
        }
       else if(str[i]=== upper[i] && str[i]!==lower[i]){ 
          uppercase++;
        } 
        else if(str[i]=== lower[i] && str[i]!== upper[i]) { 
          lowercase++;
        }
        else{
          otherCharacters++;
        }
        i++;
      }
      if(spaces>0|| str.length<8){ 
        throw 'Password does not meet the requirements. Please enter a valid password.'
      }
      if(uppercase<1 || numbers< 1 || otherCharacters<1){
        throw 'Password needs to contain at least one uppercase character, one number, and one special character.'
      } 
    if(!validator.isEmail(email)){
        throw 'Error: Invalid Email'
    }
    const userSchoolEmail = email.slice(email.indexOf('@')+1)
    let verified =false
    let school
    const schoolsJSON = await getSchools();
    for(let i = 0; i < schoolsJSON.length; i++){
        let domains = schoolsJSON[i]['domains']
        for (let domain of domains){
            if(userSchoolEmail === domain){
                verified = true
                break
            }
        }
        if(verified){
            school = schoolsJSON[i]["name"]
            break
        }
    }

    const userCollection = await users();
    const emailExists = await userCollection.findOne({ email: email });
    if (emailExists) throw 'Error: this email has already been taken.';


    const saltRounds = 3;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    const newUser = {
        name: name,
        email: email,
        school: school,
        password: hashedPass,
        verified: verified,
        ownedItems: [],
        borrowedItems: [],
        loanedItems: [],
        wishlist: [],
        karma: 0,

    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Error: Could not add User'; }
};

const userLogin = async (email, password) => {
    const userCollection = await users();
    const user = await userCollection.findOne({email: email.toLowerCase()})
    if(!user){
        throw "Invalid Username or Password"
    }
    const passwordCrypt = await bcrypt.compare(password, user.password);
    if(!passwordCrypt){
        throw "Invalid Username or Password"
    }else {
        let output = await getUserSession(user._id.toString())
        return output;
    }
};

const getUserByID = async (id) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)})

    if(!user){
        throw "No user with that ID"
    }
    delete user.password;
    user._id = user._id.toString()
    return user;
}

const getUserSession = async (id) => {
    let user = await getUserByID(id)
    user.loggedIn = true
    return user;
};

const updateUserInfo = async (id, name, email,school) => {
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId';
    if (!name || !email || !school)
        throw 'Error: All fields need to have valid values';

    if (typeof name !== 'string' && typeof email !== 'string' && typeof school !== 'string') {
        throw 'Error: One of the properties is of incorrect type and must be a string';
    }
    name = name.trim()
    email = email.trim().toLowerCase()
    school= school.trim()
    if (name.length === 0 || email.length === 0 || school.length === 0 ){
        throw 'Error: One of the properties is invalid and cannot be an empty string or just spaces';
    }
    const userCollection = await users();
    const updateUserInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: {name: name, email: email, school:school} },
        { returnDocument: 'after' });

    if (!updateUserInfo) {
        throw 'Could not update User successfully';
    }
};

const updatePassword = async (id, oldPassword, newPassword) =>{
    if (!ObjectId.isValid(id)) throw 'Invalid ObjectId';
    if (!oldPassword || !newPassword){
        throw 'Error: All fields need to have valid values';
    }
    if (typeof oldPassword !== 'string' && typeof newPassword !== 'string') {
        throw 'Error: One of the properties is of incorrect type and must be a string';
    }
    oldPassword= oldPassword.trim();
    newPassword= newPassword.trim();
    if (oldPassword.length === 0 || newPassword.length === 0){
        throw 'Error: One of the properties is invalid and cannot be an empty string or just spaces';
    }
    const userCollection = await users();
    const user= await userCollection.findOne({ _id: new ObjectId(id) });
    const equalPass = await bcrypt.compare(oldPassword, user.password);
    if(!equalPass){
        throw 'Error: Old password has to match the current password.'
    }
    let str= newPassword.trim();
    let lower= str.toLocaleLowerCase();
    let upper = str.toLocaleUpperCase();
    let lowercase= 0;
    let uppercase= 0;
    let numbers= 0;
    let spaces= 0;
    let otherCharacters= 0;
    let i = 0; 
    while (i < str.length) {
        if (str[i]===" "){
            spaces++;
        }
        else if (str[i] >= '0' && str[i] <= '9') {
            numbers++;
        }
        else if(str[i]=== upper[i] && str[i]!==lower[i]){ 
            uppercase++;
        } 
        else if(str[i]=== lower[i] && str[i]!== upper[i]) { 
            lowercase++;
        }
        else{
            otherCharacters++;
        }
        i++;
    }
    if(spaces>0|| str.length<8){ 
        throw 'Password does not meet the requirements. Please enter a valid password.'
    }
    if(uppercase<1 || numbers< 1 || otherCharacters<1){
        throw 'Password needs to contain at least one uppercase character, one number, and one special character.'
    }  
    const saltRounds = 3;
    const hashedNewPass = await bcrypt.hash(newPassword, saltRounds);
    const updateUserInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: {password : hashedNewPass} },
        { returnDocument: 'after' });
    if (!updateUserInfo) {
        throw 'Could not update User successfully';
        }
}

const getKarmaByUserID = async (id) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)})
    return user.karma;
}


const getAllUsers = async () => {
    //just for testing
    const UserCollection = await users();
    const allUsers = await UserCollection.find({}).toArray();
    return allUsers;
}

const getOwnedItemsByUserID = async (id) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)})
    const allItemsNames = [];
    const itemCollection = await items();
    for (const item of user.ownedItems){
        const itemInfo = await itemCollection.findOne({_id: new ObjectId(item._id)})
        if(itemInfo){
            const owner = await userCollection.findOne({ _id: new ObjectId(itemInfo.ownerId) });
            if (owner){
                itemInfo.ownerName = owner.name;
            }
            else{
                itemInfo.ownerName = 'N/A';
            }
            allItemsNames.push(itemInfo);
        }
    }
    if(allItemsNames.length === 0){
        return [];
    }
    return allItemsNames;
}

const getBorrowedItemsByUserID = async (id) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)})
    const borrowedItemsNames = [];
    const itemCollection = await items();
    for ( const item of user.borrowedItems){
        const itemInfo = await itemCollection.findOne({_id: new ObjectId(item)})
        if(itemInfo){
            const owner = await userCollection.findOne({ _id: new ObjectId(itemInfo.ownerId) });
            if (owner){
                itemInfo.ownerName = owner.name;
            }
            else{
                itemInfo.ownerName = 'N/A';
            }
            borrowedItemsNames.push(itemInfo);
        }
    }
    if(borrowedItemsNames.length === 0){
        return [];
    }
    return borrowedItemsNames;
}

const getLoanedItemsByUserID = async (id) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)})
    const loanedItemsNames = [];
    for ( const item of user.loanedItems){
        const itemCollection = await items();
        const itemInfo = await itemCollection.findOne({_id: new ObjectId(item)})
        if(itemInfo){
            const owner = await userCollection.findOne({ _id: new ObjectId(itemInfo.ownerId) });
            if (owner){
                itemInfo.ownerName = owner.name;
            }
            else{
                itemInfo.ownerName = 'N/A';
            }
            loanedItemsNames.push(itemInfo);
        }
    }
    if(loanedItemsNames.length === 0){
        return [];
    }
    return loanedItemsNames;
}

const updateKarma = async (id, transactionScore) => {
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)})
    if(isNaN(transactionScore)){
        throw 'Error:Transaction Score must be a number';
    }
    if(transactionScore<1 || transactionScore>10){
        throw 'Error:Transaction Score must be between 1 and 10.'
    }
    const updateUserInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: {karma: user.karma+(transactionScore-5)}},
        { returnDocument: 'after' });
    
}

export default { registerUser, userLogin, getUserByID, getUserSession, updateUserInfo, getAllUsers, updatePassword, getKarmaByUserID, getLoanedItemsByUserID, getBorrowedItemsByUserID, updateKarma, getOwnedItemsByUserID};