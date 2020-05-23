const express=require('express')
const bodyParser=require("body-parser")
const app=express()
const facebook=require("./routes/facebook")
const chat=require("./routes/chat")
const user=require("./routes/user")
const http=require("http")
const mongoose=require('mongoose')
app.use(bodyParser.urlencoded({extended: true}))

  app.use(bodyParser.json());
  // DB Config
  const db = require("./config").uri;
  // Connect to MongoDB
  mongoose
    .connect(
      db,
      { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
    let cnx = mongoose.connection;
    cnx.on('open', () => {
      console.log('Connected to the database.');
    });

    cnx.on('error', (err) => {
      console.log(`Database error: ${err}`);
    });

var server = http.createServer(app);
var io = require('socket.io').listen(server);







app.use("/api/facebook",facebook(io))
app.use("/api/chat",chat)
app.use("/api/user",user)

server.listen(5000)