"use strict";

let fs      = require("fs");
let request = require("request");
let ms      = require("ms");
let Discord = require("discord.js");

let conf    = require("./utils/configurator");
let log     = require("./utils/logger");
let helper  = require("./utils/helper");
let sendImg = require("./utils/imagehandler");

const client = new Discord.Client();
const config = conf.getConfig();

let appname = conf.getName();
let version = conf.getVersion();

console.log(
    "\n" +
    " #" + "-".repeat(12 + appname.length + version.toString().length) + "#\n" +
    " # Started " + appname + " v" + version + " #\n" +
    " #" + "-".repeat(12 + appname.length + version.toString().length) + "#\n"
);

helper.init();

client.on("ready", () => {
    log("Running...");
    log(`Got ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
    client.user.setActivity(config.botstatus);
});

client.on("guildCreate", guild => { 
    log(`Bot joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`); 
});

client.on("guildDelete", guild => { 
    log(`Bot was removed from: ${guild.name} (id: ${guild.id})`); 
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "wm"){
        if (message.channel.name == config.botChannel){
            let attachment = message.attachments.array();

            helper.download(attachment[0].url, "input.png", function(err){
                if (err){
                    message.channel.send("Oh neim! Da is was schief gegangen =(");
                    return log(err);
                }

                helper.watermark("input.png", function(){
                    message.channel.send("Jetst griegst du 1 littez Bild", {
                        files: ["watermark.png"]
                    });
                });
            });
        } 
        else return message.channel.send("Can only use in: " + config.botChannel);
    }

    //Get a red panda picture
    if (command === "rp") sendImg(false, message, client);

    // Get a red panda gif
    if (command === "rpg") sendImg(true, message, client);

    // Remove the Talkpower group from user
    if (command === "mute") {
        let member = message.mentions.members.first();
        if (!message.member.roles.some(r => [config.adminRole, config.modRole].includes(r.name))) {
            message.channel.overwritePermissions(message.member, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
                .catch(console.error);
            helper.timer('2m', function() {
                message.channel.overwritePermissions(message.member, {
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true
                    })
                    .catch(console.error);
                message.channel.send(`${message.member.user} you just got unmuted`);
            });
            return message.reply("Sorry, you don't have permissions to use this! You have been muted for 2 Minutes");
        }
        if (!member)
            return message.reply("Please mention a valid member of this server");
        let time = args.slice(1).join(' ');
        if (time.toString().length == 1) {
            time = time.toString() + 's';
        }
        if (time.toString().includes('-')) {
            return message.channel.send(`Do not use negative values!`)
        }
        message.channel.overwritePermissions(member, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            })
            .catch(console.error);
        if (time) {
            message.channel.send(`${member.user} you just got muted for ${time}`);
        } else {
            message.channel.send(`${member.user} you just got muted`);
        }
        if (time) {
            helper.timer(time, function() {
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
    if (command === "unmute") {
        let member = message.mentions.members.first();
        if (!message.member.roles.some(r => [config.adminRole, config.modRole].includes(r.name))) {
            message.channel.overwritePermissions(message.member, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
                .catch(console.error);
            helper.timer('2m', function() {
                message.channel.overwritePermissions(message.member, {
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true
                    })
                    .catch(console.error);
                message.channel.send(`${message.member.user} you just got unmuted`);
            });
            return message.reply("Sorry, you don't have permissions to use this! You have been muted for 2 Minutes");
        }
        if (!member)
            return message.reply("Please mention a valid member of this server");
        message.channel.overwritePermissions(member, {
                SEND_MESSAGES: true,
                ADD_REACTIONS: true
            })
            .catch(console.error);
        message.channel.send(`${member.user} you just got unmuted`);
    }
    // This command removes all messages from all users in the channel, up to 100.
    if (command === "purge") {
        if (!message.member.roles.some(r => [config.adminRole, config.modRole].includes(r.name))) {
            message.channel.overwritePermissions(message.member, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
                .catch(console.error);
            helper.timer('2m', function() {
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
        if (!deleteCount || deleteCount < 1 || deleteCount > 98)
            return message.reply("Please provide a number between 1 and 98 for the number of messages to delete");
        const fetched = await message.channel.fetchMessages({
            limit: deleteCount + 2
        });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
});

client.login(config.token);
