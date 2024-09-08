const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todolist');
}


const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({ name: "Wake up" });
const item2 = new Item({ name: "Eat" });
const item3 = new Item({ name: "Sleep" });
const defaultItems = [item1, item2, item3];


app.get("/", function(req, res) {
  const day = date.getDate();

  
  Item.find({}).then(function(foundItems){
    if (foundItems.length === 0) {
      // Insert default items if database is empty
      Item.insertMany(defaultItems)
        .then(() => {
          console.log("Default items added");
          res.redirect("/");
        })
        .catch(err => console.log(err));
    } else {
      
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  }).catch(err => console.log(err));
});


app.post("/", function(req, res){
  const itemName = req.body.newItem;
  
 
  const newItem = new Item({ name: itemName });
  newItem.save().then(() => {
    res.redirect("/");
  }).catch(err => console.log(err));
});


app.get("/work", function(req, res){
  res.render("list", { listTitle: "Work List", newListItems: [] }); 
});


app.get("/about", function(req, res){
  res.render("about");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
