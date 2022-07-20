const express = require("express");
const bodyParser = require("body-parser")
const ethers = require("ethers");

const provider = new ethers.providers.InfuraProvider("mainnet", "")

// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());  

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
  
app.post("/", function(req, res) {
  var message = req.body.message; 
  var [ens, user, server] = message.split(";"); 
  var signature = req.body.signature;  
  var address = ethers.utils.verifyMessage( message , signature); 
  provider.resolveName(ens).then( (ensOwner) => {
    console.log(ensOwner, address)
    if (ensOwner == address) {
        // call discord
        res.status(200).send("ok"); 
    } else {
        console.log("wa wa")
        res.status(200).send("not ok")
    }
  });
});
  
app.listen(3000, function(){
  console.log("server is running on port 3000");
})
