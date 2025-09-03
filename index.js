const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

// Index route

app.get("/chats", asyncWrap(async (req, res, next) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
}));

// new route

app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "page not found");
  res.render("new.ejs");
});

// Create route

app.post("/chats", asyncWrap(async (req, res, next) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
}));

function asyncWrap(fn) {
  return function(req, res, next){
    fn(req, res, next).catch((err) => next(err));
  }
}
// NEW - show route;

app.get("/chats/:id",asyncWrap( async (req, res, next) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if (!chat) {
    next(new ExpressError(404, "Chat not found"));
  }
  res.render("edit.ejs", { chat });
}));

// Edit route

app.get("/chats/:id/edit", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
}));

// Update route

app.put("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
    );
    res.redirect("/chats");
}));

// Distroy route

app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chatDeleted = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
}));

app.get("/", (req, res) => {
  res.send("root is working");
});

// handle specific type of error

const hadleValidationErr = (err) => {
   console.log("validation error occure please follow rules");
   console.dir(err.message);
   return err;
}
// name of Error

app.use((err, req, res, next) => {
  console.log(err.name);
  if(err.name === "ValidationError"){
   err = hadleValidationErr(err);
  }
  next(err);
});

//Error Handling middleware

app.use((err, req, res, next) => {
  let { status = 500, message = "Some Error occurred !" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log("Server is listing on port 8080");
});
