

import { closeConnection } from './config/mongoConnection.js'
import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
app.use(session({
  name: 'AuthenticationState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}))

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use("/login",(req, res, next) => {
  if(req.session.user){
    return res.redirect("/items");
  }
  return next();
})

app.use("/register",(req, res, next) => {
  if(req.session.user){
    return res.redirect("/items");
  }
  return next();
})

app.use((req, res, next) => {
  if(req.path.includes('/public')){
    return next();
  }
  if(req.path=="/" || req.path=="/login" || req.path=="/register"){
    return next();
  }
  if(!req.session.user){
    return res.redirect("/login");
  }
  return next();
})

app.use("/items/search",(req, res, next) => {
  if(req.method!='POST'){
    return next();
  }
  if(!req.body.item_search){
    return res.redirect("/items");
  }
  return res.redirect("/items/search/"+req.body.item_search);
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
}); 

import userCommands from './data/users.js'
import itemCommands from './data/items.js'
import requestCommands from './data/requests.js'
//  let biana = await userCommands.registerUser('Biana Prazdnik','bprazdnik@stevens.edu','Password$321','Password$321'); //new pass is Phone$321
//await itemCommands.addItem('6805ba13a1e02ee09cdd7790', 'finalcat','desc');
//await userCommands.updateUserInfo('6807c00082b5bf1f57e3187a', 'Riley Stewart', 'rstewar3@stevens.edu', 'Updated Stevens');
//console.log(await userCommands.updateKarma('6807d46d4c7662af05efb51e', 10));
//console.log(await userCommands.getAllUsers());
// try{
//     let requestId = await requestCommands.createRequest('6805ba13a1e02ee09cdd7790','6805ba14a1e02ee09cdd7791','6805ba63446bd355012e0730','I just want it for a bit!!');
//     console.log(requestId);
// }
// catch (e) {
//   console.log(e);
// // }

//DO NOT DELETE THESE TESTS 
//console.log(await userCommands.registerUser('Andrew Baker', 'abaker2@stevens.edu', 'Testing#1', 'Testing#1'));
//console.log(await userCommands.registerUser('Aleksey Vinogradov', 'avinogra@stevens.edu', 'Testing#1', 'Testing#1'));
//console.log(await itemCommands.addItem("681fd2471883944e9bf17139",'Screwdriver', 'Screws and stuff'));
//console.log(await userCommands.getOwnedItemsByUserID("681fd2471883944e9bf17139"));
//console.log(await itemCommands.getItemsBySchool('681fd2481883944e9bf1713a', 'Stevens Institute of Technology'));
// LenderID, borrowerID, itemID, borrowerDescription,
// console.log(await requestCommands.createRequest('681fdc542f0f7060055aa06c','6818c6b07ac358a1a86f819d','681fdc912f0f7060055aa06d', 'test desc 2'));
// console.log(await requestCommands.acceptRequest("6818c7829ae85f4311beeca7"));
//console.log(await requestCommands.getRequestBorrowerId('6818c7829ae85f4311beeca7'))
//console.log(await userCommands.getBorrowedItemsByUserID("681fd2471883944e9bf17139"));
//console.log(await userCommands.getLoanedItemsByUserID("681fd2471883944e9bf17139"));
//console.log(await requestCommands.completeRequest("6816ae8effad4957f8522145"));
//console.log(await itemCommands.getItemHistory('681696434fcef8a1b6f9965d'));

// closeConnection()





