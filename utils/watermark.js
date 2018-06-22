"use strict";

let fs = require("fs");
let gm = require("gm").subClass({ imageMagick: true });

let log = require("./logger");

module.exports = {
    watermark: function(fileName, callback){
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
    }
};
