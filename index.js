const express = require("express");
const bodyParser = require("body-parser")
const ethers = require("ethers");
const { Client, Intents } = require('discord.js');

const dotenv = require("dotenv")
dotenv.config()

const provider = new ethers.providers.InfuraProvider("mainnet", process.env.INFURA_KEY)

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'verifyens') {
    await interaction.reply({
      content: 'Click here to verify: ' + `http://localhost:3000/verify?server=${interaction.guildId}&user=${interaction.user.id}`, 
      ephemeral: true
    }) 
	} // TODO: Add setup step to configure which role to set on verification
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

app.get("/verify", function(req, res) {
  res.sendFile(__dirname + "/verify.html");
});
  
app.post("/verify", function(req, res) {
  var message = req.body.message; 
  var [ens, server, user] = message.split(";"); 
  var signature = req.body.signature;  
  var address = ethers.utils.verifyMessage( message , signature); 

  provider.resolveName(ens).then( async (ensOwner) => {
    let guild = await client.guilds.fetch(server); 
    let member = await guild.members.fetch(user); 
    await guild.roles.fetch(); 
    if (ensOwner == address) {
        var role = guild.roles.cache.find(role => role.name == "CuriousCookie") // TODO: Role to be configured at setup
        member.roles.add(role); 
        member.setNickname(`${member.nickname} | ${ens}`); 
        res.status(200).send("ok") // TODO: redirect to success page
    } else {
        res.status(200).send("not ok") // TODO: redirect to failure page
    }
  });
});
  
app.listen(3000, function(){
  console.log("server is running on port 3000");
})
