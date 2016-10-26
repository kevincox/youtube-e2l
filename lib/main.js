/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
	//contentStyleFile:  data.url("embed2yt.css"),
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
