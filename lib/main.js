var {Cc,Ci,Cu,Cr,Cm,components} = require("chrome");

var data = require("sdk/self").data;
var prefs = require("sdk/preferences/service");
var pp = "extensions.youtube-e2l@jetpack."; // Pref Prefix, or urine.

if ( prefs.get(pp+"url") == "" )
{
	Cu.import("resource://gre/modules/Services.jsm");
	
	if ( Services.appinfo.OS == "Android" ) prefs.set(pp+"url", "vnd.youtube:%vid%");
	else                                    prefs.set(pp+"url", "//youtu.be/%vid%");
	
	Cu.unload("resource://gre/modules/Services.jsm");
}

require("sdk/page-mod").PageMod({
	include: ["file://*", "resource://*", "*"],
	attachTo: ["existing", "top", "frame"],
	contentScriptFile: data.url("embed2yt.js"),
	contentStyleFile:  data.url("embed2yt.css"),
	contentScriptWhen: "start",
	
	contentScriptOptions: {
		showOptions: true,
		pref: {
			url: prefs.get(pp+"url"),
			thumbnailQuality: prefs.get(pp+"thumbnailQuality"),
		},
		playIcon: data.url("shadowedplay.svg"),
	},
	
	//onAttach: function(worker) {},
});
