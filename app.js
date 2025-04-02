import express from 'express';
const app = express();
import configRoutesFunction from './routes/index.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
configRoutesFunction(app);

app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
    res.redirect("/home");
  });

  app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});