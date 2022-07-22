# Run the Discord Bot on your server

1. Invite the bot to your server. Click on the link in index.html
2. Run `node deploy-commands.js` (Already done, no need to do it again for the bot above) 
3. Deploy the node.js project and run it (straightforward npm install and node .; the only tricky bit is configuring a keyV store.)
4. Invite the bot to a channel and run `/setup <RoleName>`. Anyone who passes verification will have the added role of `RoleName`. 
5. Call `/verifyens` to verify your ENS. Nickname will also be changed to `{x}.eth` (doesn't work for `Managers`) 

