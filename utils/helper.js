"use strict";

let fs      = require("fs");
let request = require("request");

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

let watermark = function(fileName, callback){
    gm(fileName)
        .out('-rotate')
        .out(-90)
        .out('-background')
        .out('rgba(0, 0, 0, .75)')
        .out('-fill')
        .out('#FFFFFF')
        .font('./fonts/BebasNeue.otf')
        .pointSize(30)
        .gravity('South')
        .out('-size')
        .out(245)
        .out('caption:savetheinternet.info')
        .out('-geometry')
        .out('+0+10')
        .out('-composite')
        .out('-rotate')
        .out(90)
        .write('watermark.png', function(err){
            if (err){
                log(err, true);
                return console.dir(arguments);
            }
            callback();
        }
    )
};

module.exports = {
    init: init,
    download: download,
    timer: timer,
    watermark: watermark
};
