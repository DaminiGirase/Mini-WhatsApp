const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
.then(() => console.log("connection successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
  from: "arjun",
  to: "meera",
  msg: "Send your detail for adding you",
  created_at: new Date(),
},
{
  from: "meera",
  to: "arjun",
  msg: "I’ll send it shortly",
  created_at: new Date(),
},
{
  from: "rohan",
  to: "sneha",
  msg: "Please also share your email",
  created_at: new Date(),
},
{
  from: "sneha",
  to: "rohan",
  msg: "Sure, I’ll share by evening",
  created_at: new Date(),
},
{
  from: "amit",
  to: "riya",
  msg: "Thanks, I’ll update after receiving",
  created_at: new Date(),
},
{
  from: "riya",
  to: "amit",
  msg: "Okay, let me know once done",
  created_at: new Date(),
}
];

Chat.insertMany(allChats);



