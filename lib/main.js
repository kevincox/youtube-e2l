var data = require("self").data;
var pageMod = require("page-mod");
var prefs = require("preferences-service");

var pp = "extensions.youtube-e2l@jetpack.";
 
pageMod.PageMod({
    include: "*",
    attachTo: ["existing", "top"],
    contentScriptFile: data.url("embed2yt.js"),
    contentStyleFile:  data.url("embed2yt.css"),

    onAttach: function(worker) {
        worker.port.emit("gotData", {
            pref: {
                thumbnailQuality: prefs.get(pp+"thumbnailQuality"),
            },
        
            playIcon: data.url("play.png"),
        });
    },
});