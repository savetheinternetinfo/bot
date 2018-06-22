"use strict";
var fs = require('fs');
var request = require('request');
var ms = require('ms');
// Discord.js
const Discord = require('discord.js');
const client = new Discord.Client();
// Configuration
const config = require("./config.json");
// Modules
var pWM = require('./watermark/module.js');
// Notification for the bot being ready
client.on('ready', () => {
  console.log('Running');
});
// HELPER FUNCTIONS
String.prototype.hashCode = function() {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
// Request a file and download it
var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
// Set a timer for callback function
var timer = function(time, callback) {
  setTimeout(function() {
    callback();
  }, ms(time));
};
client.on('message', async message => {
// Ignore myself -> Pech ghant :(
if(message.author.bot) return;
// Force to make the prefix on first character
if(message.content.indexOf(config.prefix) !== 0) return;
// Command args
const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
// Adds a 9gag- like watermark to the image (if there is any)
if(command === "wm") {
  if(message.channel.name == config.botChannel) {
    try{
      var attachment = message.attachments.array()
        download(attachment[0].url, 'input.png', function(){
          pWM.watermark('input.png', function(){
            message.channel.send('Jetst griegst du 1 littez Bild', {
                files: [
                    "watermark.png"
                ]
            });
          });
        });
      } catch(err) {
      console.log(err);
    };
  } else {
    return message.channel.send('Can only use in: ' + config.botChannel);
  }
}
// Get a red panda picture
if(command === "asdf") {
  if(message.channel.name == config.botChannel) {
    var options = {
      rejectUnauthorized: false,
      url: config.redPandaImage,
      method: 'GET',
      headers: {
          'Accept': 'image/png',
          'User-Agent': 'discordbot'
      }
    };
    let req = request(options).on("response", res => {
      let threadhash = "asdf";
      res.on("data", data => {
        req.pipe(fs.createWriteStream("./tmp/" + threadhash + "-panda.png")).on('close', function() {message.channel.send('Roter Panda Coppung!', {files: ["./tmp/" + threadhash + "-panda.png"]})});
      });
    });
  } else {
    return message.channel.send('Can only use in: ' + config.botChannel);
  }
}
// Get a red panda picture
if(command === "rp") {
  if(message.channel.name == config.botChannel) {
    var options = {
      rejectUnauthorized: false,
      url: config.redPandaImage,
      method: 'GET',
      headers: {
          'Accept': 'image/png',
          'User-Agent': 'discordbot'
      }
    };
    request(options, function(err, res, body) {
      if (!err && res.statusCode == 200) {
      } else {
        console.log(err);
      }
    }).pipe(fs.createWriteStream('panda.png')).on('close', function() {message.channel.send('Roter Panda Coppung!', {files: ["panda.png"]})});
  } else {
    return message.channel.send('Can only use in: ' + config.botChannel);
  }
}
// Get a red panda gif
if(command === "rpg") {
  if(message.channel.name == config.botChannel) {
    var options = {
      rejectUnauthorized: false,
      url: config.redPandaGIF,
      method: 'GET',
      headers: {
          'Accept': 'image/gif',
          'User-Agent': 'discordbot'
      }
    };
    request(options, function(err, res, body) {
      if (!err && res.statusCode == 200) {
      } else {
        console.log(err);
      }
    }).pipe(fs.createWriteStream('panda.gif')).on('close', function() {message.channel.send('Roter Panda Coppung!', {files: ["panda.gif"]})});
  } else {
    return message.channel.send('Can only use in: ' + config.botChannel);
  }
}
// Remove the Talkpower group from user
if(command === "mute") {
  let member = message.mentions.members.first();
  if(!message.member.roles.some(r=>[config.adminRole, config.modRole].includes(r.name)))
  {
    message.channel.overwritePermissions(message.member, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    })
    .catch(console.error);
        timer('2m', function() {
          message.channel.overwritePermissions(message.member, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
          })
          .catch(console.error);
          message.channel.send(`${message.member.user} you just got unmuted`);
    });
    return message.reply("Sorry, you don't have permissions to use this! You have been muted for 2 Minutes");
  }
  if(!member)
    return message.reply("Please mention a valid member of this server");
    let time = args.slice(1).join(' ');
  if(time.toString().length == 1) {
    time = time.toString() + 's';
  }
  if(time.toString().includes('-')) {
    return message.channel.send(`Do not use negative values!`)
  }
  message.channel.overwritePermissions(member, {
    SEND_MESSAGES: false,
    ADD_REACTIONS: false
  })
  .catch(console.error);
  if(time){
    message.channel.send(`${member.user} you just got muted for ${time}`);
  } else {
    message.channel.send(`${member.user} you just got muted`);
  }
  if(time) {
    timer(time, function() {
      message.channel.overwritePermissions(member, {
        SEND_MESSAGES: true,
        ADD_REACTIONS: true
      })
      .catch(console.error);
      message.channel.send(`${member.user} you just got unmuted`);
    });
  }
}
// Add the Talkpower group from user
if(command === "unmute") {
  let member = message.mentions.members.first();
  if(!message.member.roles.some(r=>[config.adminRole, config.modRole].includes(r.name)))
  {
    message.channel.overwritePermissions(message.member, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    })
    .catch(console.error);
        timer('2m', function() {
          message.channel.overwritePermissions(message.member, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
          })
          .catch(console.error);
          message.channel.send(`${message.member.user} you just got unmuted`);
    });
    return message.reply("Sorry, you don't have permissions to use this! You have been muted for 2 Minutes");
  }
  if(!member)
    return message.reply("Please mention a valid member of this server");
    message.channel.overwritePermissions(member, {
      SEND_MESSAGES: true,
      ADD_REACTIONS: true
    })
    .catch(console.error);
    message.channel.send(`${member.user} you just got unmuted`);
}
// This command removes all messages from all users in the channel, up to 100.
if(command === "purge") {
  if(!message.member.roles.some(r=>[config.adminRole, config.modRole].includes(r.name)))
  {
    message.channel.overwritePermissions(message.member, {
      SEND_MESSAGES: false,
      ADD_REACTIONS: false
    })
    .catch(console.error);
        timer('2m', function() {
          message.channel.overwritePermissions(message.member, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
          })
          .catch(console.error);
          message.channel.send(`${message.member.user} you just got unmuted`);
    });
    return message.reply("Sorry, you don't have permissions to use this! You have been muted for 2 Minutes");
  }
  const deleteCount = parseInt(args[0], 10);
  message.reply(deleteCount);
  if(!deleteCount || deleteCount < 1 || deleteCount > 98)
    return message.reply("Please provide a number between 1 and 98 for the number of messages to delete");
  const fetched = await message.channel.fetchMessages({limit: deleteCount + 2});
  message.channel.bulkDelete(fetched)
    .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});
// Login the bot
client.login(config.token);
