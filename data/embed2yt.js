function replaceWithThumbnail ( info )
{
	let tn = document.createElement("a");
	tn.href = self.options.pref.url.replace("%vid%", info.id);
	
	tn.className = "embed2yt-thumbnail";

	// Start of workaround for https://bugzil.la/1107240
	tn.style.padding = "0px";
	tn.style.boxSizing = "border-box";
	tn.style.display = "block";
	tn.style.overflow = "none";
	tn.style.whiteSpace = "nowrap";
	tn.style.color = "white";
	tn.style.textDecoration = "none";
	tn.style.font = "1.7em helvetica";
	tn.style.textAlign = "left";
	tn.style.backgroundColor = "black";
	tn.style.backgroundSize = "6em, cover";
	tn.style.backgroundRepeat = "no-repeat, no-repeat";
	tn.style.backgroundPosition = "center center";
	tn.style.backgroundRepeat = "no-repeat, no-repeat";
	// End of workaround

	tn.style.width  = info.width;
	tn.style.height = info.height;
	
	info.replace.parentNode.insertBefore(tn, info.replace);
	info.replace.parentNode.removeChild(info.replace);
	
	let req = new XMLHttpRequest();
	req.open('GET', 'http://www.youtube.com/oembed?format=json&amp;url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + info.id);
	req.responseType = "json";
	req.onload = function(e) {
		var t = document.createElement("div");
		t.textContent = req.response.title;
		t.className = "embed2yt-title";

		// Start of workaround for https://bugzil.la/1107240
		t.style.background = "hsla(0, 0%, 0%, 0.5)";
		t.style.padding = "0 0.4em";
		// End of workaround

		tn.appendChild(t);
		
		tn.style.backgroundImage = "url("+self.options.playIcon+")," +
								   "url('" + req.response.thumbnail_url + "')";
	};
	req.send();
}

var ytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/embed/([^/?#&]*).*$","i");
var oytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/v/([^/?#&]*).*$","i");

function scanElement(ele)
{
	var infolist = [];
	
	var frames = ele.getElementsByTagName("iframe");
	for ( i in frames )
	{
		var f = frames[i];
		if ( f.tagName != "IFRAME" ) continue; // We are also getting properties.
		var r = f.src.match(ytre);
		if (r)
		{
			infolist.push({
				id: r[4],
				replace: f,
				width:  f.width  + "px",
				height: f.height + "px",
			});
		}
	}
	
	var objects = ele.getElementsByTagName("object");
	for ( i in objects )
	{
		var o = objects[i];
		if ( o.tagName != "OBJECT" ) continue; // We are also getting properties.
		var e = o.getElementsByTagName("embed")[0];
		
		var url;
		if      (e)      url = e.src;
		else if (o.data) url = o.data;
		else             url = "";
		
		var r = url.match(oytre);
		if (r)
		{
			infolist.push({
				id: r[4],
				replace: o,
				width:  o.width  + "px",
				height: o.height + "px",
			});
		}
	};
	
	for ( i in infolist )
		replaceWithThumbnail(infolist[i]);
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		scanElement(mutation.target);
	});
});

// pass in the target node, as well as the observer options
observer.observe(document, { childList: true, subtree: true });
