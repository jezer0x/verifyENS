const express = require("express");
const bodyParser = require("body-parser")
const ethers = require("ethers");
const { Client, Intents } = require('discord.js');
const Keyv = require('keyv');

const dotenv = require("dotenv");

dotenv.config()
const keyv = new Keyv(); // TODO: select a backend and do a non-ephemeral storage https://discordjs.guide/keyv/#installation

const provider = new ethers.providers.InfuraProvider("mainnet", process.env.INFURA_KEY)

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

  if (commandName === 'verifyens') {
    await interaction.reply({
      content: 'Click here to verify: ' + `http://localhost:3000/verify?server=${interaction.guildId}&user=${interaction.user.id}`, 
      ephemeral: true
    })
	} else if (commandName === 'setup') {
    const role = await interaction.options.getRole('role'); 
    keyv.set(interaction.guildId, role.id)
    await interaction.reply({
      content: "Role set properly"
    })
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());  

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

app.get("/failure", function(req, res) {
  res.sendFile(__dirname + "/failure.html");
});

app.get("/success", function(req, res) {
  res.sendFile(__dirname + "/success.html");
});

app.get("/verify", function(req, res) {
  res.sendFile(__dirname + "/verify.html");
});
  
app.post("/verify", function(req, res) {
  var message = req.body.message; 
  var [ens, server, user] = message.split(";"); 
  var signature = req.body.signature;  
  var address = ethers.utils.verifyMessage( message , signature); 

  provider.resolveName(ens).then( async (ensOwner) => {
    let guild, member; 
    try { 
      guild = await client.guilds.fetch(server); 
      member = await guild.members.fetch(user); 
      if (ensOwner == address) {
        let role = await keyv.get(guild.id); 
        member.roles.add(role); 
        member.setNickname(`${ens}`); 
        res.status(200).send()
      } else {
          res.status(403).send()
      }
    } catch {
      return res.status(400).send("Something went wrong")
    }
  });
});
  
app.listen(3000, function(){
  console.log("server is running on port 3000");
})
