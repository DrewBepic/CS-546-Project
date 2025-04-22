/*

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

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
}); */

import { closeConnection } from './config/mongoConnection.js'
import userCommands from './data/users.js'
import itemCommands from './data/items.js'
import requestCommands from './data/requests.js'
//  let elijah = await userCommands.registerUser('Elijah Joseph','ejoseph1@stevens.edu','abc','abc');
//await itemCommands.addItem('6805ba13a1e02ee09cdd7790', 'finalcat','desc');
//await userCommands.updateUserInfo('6807c00082b5bf1f57e3187a', 'Riley Stewart', 'rstewar3@stevens.edu', 'Updated Stevens');
//console.log(await userCommands.getUserByID('6807c00082b5bf1f57e3187a'));
//console.log(await userCommands.getKarmaByUserID('6807d46d4c7662af05efb51e'));
// try{
//     // let requestId = await requestCommands.createRequest('6805ba13a1e02ee09cdd7790','6805ba14a1e02ee09cdd7791','6805ba63446bd355012e0730','I just want it for a bit!!');
//     await requestCommands.completeRequest("6805c362a20776fb8ed1d282");
// }
// catch (e) {
//   console.log(e);
// }

closeConnection()
