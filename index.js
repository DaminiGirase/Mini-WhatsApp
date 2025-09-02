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

app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  res.render("index.ejs", { chats });
});

// new route

app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "page not found");
  res.render("new.ejs");
});

// Create route

app.post("/chats", (req, res) => {
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });

  newChat
    .save()
    .then((res) => {
      console.log("saved chat");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/chats");
});

// NEW - show route;

app.get("/chats/:id", async(req, res, next) => {
  let {id} = req.params;
  let chat = await Chat.findById(id);
  if(!chat) {
    next(new ExpressError(404, "Chat not found")) ;
  }
  res.render("edit.ejs", {chat});
});

// Edit route

app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat });
});

// Update route

app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { msg: newMsg } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { msg: newMsg },
    { runValidators: true, new: true },
  );
  res.redirect("/chats");
});


// Distroy route

app.delete("/chats/:id", async(req, res) => {
    let {id} = req.params;
    let chatDeleted = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});

app.get("/", (req, res) => {
  res.send("root is working");
});

//Error Handling middleware

app.use((err, req, res, next) => {
  let {status = 500, massage = "Some Error occurred"} = err;
  res.status(status).send(massage);
});

app.listen(port, () => {
  console.log("Server is listing on port 8080");
});
