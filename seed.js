import userCommands from './data/users.js'
import itemCommands from './data/items.js'
import requestCommands from './data/requests.js'
import { dbConnection,closeConnection } from './config/mongoConnection.js'
const db = await dbConnection();
await db.dropDatabase();

const user1Id = (await userCommands.registerUser('Henry Poppins', 'hpop@stevens.edu', 'Password123!', 'Password123!')).insertedId.toString()
const user2Id = (await userCommands.registerUser('Sponge Bob', 'sbob@stevens.edu', 'Password123!', 'Password123!')).insertedId.toString()
const user3Id = (await userCommands.registerUser('Jack Cooper', 'jcoop@stevens.edu', 'Password123!', 'Password123!')).insertedId.toString()

const item1Id = (await itemCommands.addItem(user1Id,'Screwdriver', 'Screws and stuff',true)).toString()
const item2Id = (await itemCommands.addItem(user1Id,'Drill', 'Drills stuff',true)).toString()
const item3Id = (await itemCommands.addItem(user2Id,'Pickaxe', 'Rock and Stone',true)).toString()
const item4Id = (await itemCommands.addItem(user2Id,'Shovel', "Let's get this dirt out of the way",true)).toString()
const item5Id = (await itemCommands.addItem(user3Id,'3D Printer', "Print in plastic",true)).toString()
const item6Id = (await itemCommands.addItem(user3Id,'Mongo Database', "An entire mongo database because why not",true)).toString()

const request1Id = (await requestCommands.createRequest(user2Id,user3Id,item3Id, 'Please I need to go mining in my backyard. I found gold and I need a pickaxe!')).toString()
const request2Id = (await requestCommands.createRequest(user3Id,user1Id,item6Id, "I'm starting this really cool project and I need to borrow a Mongo Database")).toString()
const request3Id = (await requestCommands.createRequest(user1Id,user3Id,item2Id, 'So I found this entire gold pile in my backyard and I need as many power tools as I can get my hands on to get it')).toString()
const request4Id = (await requestCommands.createRequest(user2Id,user3Id,item4Id, 'So I found this entire gold pile in my backyard and I need as many tools as I can get my hands on to get it')).toString()
const request5Id = (await requestCommands.createRequest(user3Id,user2Id,item5Id, 'I am printing a portrait of my donkey and I need a 3d-printer for its tail')).toString()

const acceptedRequest1 = await requestCommands.acceptRequest(request4Id)
const acceptedRequest2 = await requestCommands.acceptRequest(request5Id)

const completeRequest1 = await requestCommands.completeRequest(request4Id)

const karma1 = await requestCommands.updateRequestKarma(request4Id, 10, user2Id)



closeConnection()