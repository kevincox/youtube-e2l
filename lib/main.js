var {Cc,Ci,Cu,Cr,Cm,components} = require("chrome");

var data = require("self").data;
var prefs = require("preferences-service");
var pp = "extensions.youtube-e2l@jetpack."; // Pref Prefix, or urine.

if ( prefs.get(pp+"url") == "" )
{
	Cu.import("resource://gre/modules/Services.jsm");

	if ( Services.appinfo.OS == "Android" ) prefs.set(pp+"url", "vnd.youtube:%vid%");
	else                                    prefs.set(pp+"url", "//youtu.be/%vid%");

	Cu.unload("resource://gre/modules/Services.jsm");
}
console.log(prefs.get(pp+"url"));

require("page-mod").PageMod({
	include: "*",
	attachTo: ["existing", "top"],
	contentScriptFile: data.url("embed2yt.js"),
	contentStyleFile:  data.url("embed2yt.css"),
	//contentScriptWhen: "ready",

	contentScriptOptions: {
		showOptions: true,
		pref: {
			url: prefs.get(pp+"url"),
			thumbnailQuality: prefs.get(pp+"thumbnailQuality"),
		},
		playIcon: data.url("play.png"),
	},

	//onAttach: function(worker) {},
});
