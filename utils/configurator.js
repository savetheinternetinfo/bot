"use strict";

let fs  = require("fs");
let log = require("./logger");

require.extensions[".json"] = function (module, filename) { module.exports = fs.readFileSync(filename, "utf8"); };

const path = "../config.json";
const pack = require("../package.json");

let pInfo = JSON.parse(pack);

const defaults = {
    "token": "verstehichnursosemi.png",
    "prefix": "!",
    "botstatus": "Saving the internet...",
    "adminRole": "Teamlead",
    "modRole": "Moderator",
    "botChannel": "botspam",
    "redPandaImage": "http://api.pandarosso.eu/random?max_size=8000000",
    "redPandaGIF": "http://api.pandarosso.eu/random?type=gif"
};

let reset = function(){ 
    try { fs.writeFileSync(path, JSON.stringify(defaults, null, 4)); }
    catch (err) { return log("Could not reset config: " + err, true); }
    log("Config has been reset");
};

let getconfig = function(){
    if (!fs.existsSync(path)){
        log("Config does not exist!", true);
        reset();
    } 
    
    let jsondata = require(path);
    if (validateJSON(jsondata)) return JSON.parse(jsondata);

    else {
        log("Config is invalid! Resetting...", true);
        reset();
        jsondata = require(path);
        return defaults;
    }
};

function validateJSON(input){
    try { JSON.parse(input); } 
    catch (e){ return false; }
    return true;
}

let getVersion = function(){ return pInfo.version;     };
let getName    = function(){ return pInfo.name;        };

module.exports = {
    getConfig:      getconfig,
    reset:          reset,
    getVersion:     getVersion,
    getName:        getName
};
