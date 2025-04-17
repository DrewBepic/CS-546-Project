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
}); 
*/

import { closeConnection } from './config/mongoConnection.js'
import userCommands from './data/users.js'
import itemCommands from './data/items.js'
//let adew = await userCommands.registerUser('andrew baker', 'abaker2@stevens.edu', 'abc', 'abc');
//await itemCommands.addItem('680084f7a1c1f0d8117af059', 'finalcat','desc');
//await itemCommands.updateItem('68008f99f7a5b3f90feda30d', 'updated2', 'updated');
await itemCommands.removeFromWishlist('680084f7a1c1f0d8117af059', '680114568f3b1b75b0682ebe');
//await itemCommands.removeItem('68008c1e696041adabdb308b');

closeConnection()