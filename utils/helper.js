"use strict";

let fs      = require("fs");
let ms      = require("ms");
let request = require("request");
let gm = require('gm').subClass({imageMagick: true});

let isset = function(obj){
    return !!(obj && obj !== null && (typeof obj === 'string' || typeof obj === 'number' && obj !== "") || obj === 0);
};

let init = function(){
    const tmppath = "./tmpdata";
    if (!fs.existsSync(tmppath)) fs.mkdirSync(tmppath);
};

let download = function(uri, filename, callback){
    try {
        request.head(uri, function(err, res, body){
            if (err) callback(err);
            request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
        });
    }
    catch (err){ callback(err); }
};

//Set a timer for callback function
let timer = function(time, callback){
    setTimeout(function(){
        callback();
    }, ms(time));
};

let unmute = function(user, channel){
    channel.overwritePermissions(user, {
        SEND_MESSAGES: true,
        ADD_REACTIONS: true
    }).catch(console.error);
    channel.send(`${user.user} you just got unmuted`);
    log("User " + user.user + " was unmuted.");
};

let mute = function(user, channel, time){
    channel.overwritePermissions(user, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
    }).catch(console.error);
    log("User " + user.user + " was muted.");

    if (isset(time)){
        timer(time, function(){
            unmute(user, channel);
        });
    }
};

let watermark = function(fileName, callback){
    gm(fileName)
        .out("-rotate")
        .out(-90)
        .out("-background")
        .out("rgba(0, 0, 0, .75)")
        .out("-fill")
        .out("#FFFFFF")
        .font("./fonts/BebasNeue.otf")
        .pointSize(30)
        .gravity("South")
        .out("-size")
        .out(245)
        .out("caption:savetheinternet.info")
        .out("-geometry")
        .out("+0+10")
        .out("-composite")
        .out("-rotate")
        .out(90)
        .write("watermark.png", function(err){
            if (err){
                log(err, true);
                return console.dir(arguments);
            }
            callback();
        }
    )
};

module.exports = {
    isset: isset,
    init: init,
    download: download,
    timer: timer,
    unmute, unmute,
    mute: mute,
    watermark: watermark
};
