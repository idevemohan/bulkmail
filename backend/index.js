const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")

const app = express();
const allowedOrigins = [
  'https://bulkmail-frontendd.onrender.com',  // your frontend URL
  // maybe also local dev e.g. 'http://localhost:3000'
];
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],  // whichever you use
  allowedHeaders: ['Content-Type', 'Authorization'],  // add other custom headers if any
  credentials: true   // if you are using cookies, auth etc.
}));

mongoose.connect("mongodb+srv://devemohan:4496@cluster0.aki5yoz.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Connected to DB")
}).catch(function(){
    console.log("Failed to Connect")
})

const credential=mongoose.model("credential",{},"bulkmail")


app.post("/sendemail", function (req, res) {
  var msg = req.body.msg;
  var emailList = req.body.emailList;

  credential.find().then(function(data){
     const transporter = nodemailer.createTransport({
  service: "gmail",

  // true for 465, false for other ports
  auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
});

 new Promise(async function(resolve,reject) {
    try {
      for (var i = 0; i < emailList.length; i++)
        {
          await transporter.sendMail({
          from: "jayalakshmideve@gmail.com",
          to: emailList[i],
          subject: "A message from bulkmail",
          text: msg,
        });
      }
      resolve("Success");
    } catch (error) {
      reject("Failed");
    }
  }).then(function(){
      res.send(true)
  })
  .catch(function(error){
     res.send(false)
  })

   
}).catch(function(error){
    console.log(error)
})
  
})

app.listen(3000, function () {
  console.log("Server Started....");
});
