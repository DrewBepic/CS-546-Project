import express from "express";
const router = express.Router();
import userCommands from '../data/users.js'
import itemCommands from '../data/items.js'

router.route('/').get(async (req, res) => {
  return res.render('home', {title: "CampusExchange"});
  //code here for GET will render the home handlebars file
});

export default router;