
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const morgan = require("morgan");



const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
const House = require('./models/house.js');

app.get("/", async (req, res) => {
  res.render("landing.ejs");
});

app.get("/houses", async (req, res) => {
  const allHouses = await House.find();
  console.log(allHouses); 
  res.render("houses/index.ejs", { houses: allHouses });
});



app.get("/houses/detail", async (req, res) => {
  res.render("houses/new.ejs");
});


app.post("/houses", async (req, res) => {
  if (req.body.isReadyToBook === "on") {
    req.body.isReadyToBook = true;
  } else {
    req.body.isReadyToBook= false;
  }
  await House.create(req.body);
  res.redirect("/houses");
});

app.get("/houses/:houseId", async (req, res) => {
  const foundHouse = await House.findById(req.params.houseId);
  res.render("houses/show.ejs", { house: foundHouse });
});

app.delete("/houses/:houseId", async (req, res) => {
  await House.findByIdAndDelete(req.params.houseId);
  res.redirect("/houses");
});

app.get("/houses/:houseId/edit", async (req, res) => {
  const foundHouse = await House.findById(req.params.houseId);
  res.render("houses/edit.ejs", {
    house: foundHouse,
  });
});



app.put("/houses/:houseId", async (req, res) => {

  if (req.body.isReadyToBook === "on") {
    req.body.isReadyToBook = true;
  } else {
    req.body.isReadyToBook = false;
  }
  
  await House.findByIdAndUpdate(req.params.houseId, req.body);

  res.redirect(`/houses/${req.params.houseId}`);
});


app.listen(4000, () => {
  console.log("Listening on port 4000");
});

