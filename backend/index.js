const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")

const app = express();
app.use(express.json());
app.use(cors());

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
