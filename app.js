// import express from 'express';
// const app = express();
// import configRoutes from './routes/index.js';
// import exphbs from 'express-handlebars';

// app.use('/public', express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// configRoutes(app);

// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log('Your routes will be running on http://localhost:3000');
// });

import userCommands from './data/users.js'

await userCommands.registerUser('Andrew Baker', 'abaker2@stevens.edu', 'Stevens', 'Hello')