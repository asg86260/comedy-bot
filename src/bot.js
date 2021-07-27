const tmi = require('tmi.js');
require('dotenv').config();
let { humor } = require('../store')
// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

setInterval(() => {
  console.log("current humor", humor)
}, 5000)
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  let op = commandName.slice(0,1)
  console.log(msg, humor)
  if (['+','-'].includes(op)) {
    let numString = commandName.slice(1, commandName.length)
    let num = Number(numString)
    if (!!num && op === '+') humor += Number(humor)
    else if (!!num && op ==='-') humor = humor - Number(humor)
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}