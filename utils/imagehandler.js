"use strict";

let fs      = require("fs");
let request = require("request");

let log  = require("./logger");
let conf = require("./configurator");

const config = conf.getConfig();

let sendImg = function(isGif, message, client){
    if (message.channel.name == config.botChannel){
        var options = {
            "rejectUnauthorized": false,
            "url": isGif ? config.redPandaGIF : config.redPandaImage,
            "method": "GET",
            "headers": {
                "Accept": "image/" + isGif ? "gif" : "png",
                "User-Agent": "discordbot"
            }
        };

        let imgpath = "./tmpdata/panda." + (isGif ? "gif" : "png");
        request(options, function(err, res, body){
            if (err || res.statusCode != 200){
                message.channel.send("Oh neim! Da is was schief gegangen =(");
                return log(err);   
            }
        }).pipe(fs.createWriteStream(imgpath)).on("close", function(){
            message.channel.send("Roter Panda Coppung!", {
                "files": [imgpath]
            });
        });
    } 
    else return message.channel.send("Can only use in: " + config.botChannel);
};

module.exports = sendImg;
