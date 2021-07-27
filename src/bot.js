const tmi = require('tmi.js');
require('dotenv').config();
const fs = require('fs');
let humorRaw = fs.readFileSync('store/index.json');
let store = JSON.parse(humorRaw);

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

//save score every 60 seconds
setInterval(saveHumor, 60000)

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  let op = commandName.slice(0,1)
  if (['+','-'].includes(op)) {
    
    let numString = commandName.slice(1, commandName.length)
    let num = Number(numString)

    if (!!num && op === '+') store.humor = Number(store.humor) + num
    else if (!!num && op ==='-') store.humor = Number(store.humor) - num

    console.info(`updating humor: ${commandName}, humor: ${store.humor}`)
  } else if (commandName === '!funny') {
    client.say(target, store.humor.toString())
  }
}

function saveHumor() {
  console.info("saving current humor...", store.humor)
  let data = JSON.stringify({humor: store.humor});
  fs.writeFileSync('store/index.json', data);
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}