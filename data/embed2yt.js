function replaceWithThumbnail ( info )
{
	let tn = document.createElement("a");
	tn.href = self.options.pref.url.replace("%vid%", info.id);

	tn.className = "embed2yt-thumbnail";
	tn.style.display = "block";
	tn.style.width  = info.width;
	tn.style.height = info.height;

	info.replace.parentNode.insertBefore(tn, info.replace);
	info.replace.parentNode.removeChild(info.replace);

	let req = new XMLHttpRequest();
	req.open('GET', 'https://gdata.youtube.com/feeds/api/videos/'+info.id+'?v=2&alt=jsonc');
	req.responseType = "json";
	req.onload = function(e) {
		var t = document.createElement("div");
		t.textContent = req.response.data.title;
		t.className = "embed2yt-title"
		tn.style.display = "block";
		tn.appendChild(t);

		tn.style.backgroundImage = "url("+self.options.playIcon+")," +
		                           "url("+req.response.data.thumbnail[self.options.pref.thumbnailQuality]+")";
	};
	req.send();
}

var infolist = [];

var ytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/embed/([^/?#]*).*$","i");

var frames = document.getElementsByTagName("iframe");
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

var oytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/v/([^/?#]*).*$","i");

var objects = document.getElementsByTagName("object");
for ( i in objects )
{
	var o = objects[i];
	if ( o.tagName != "OBJECT" ) continue; // We are also getting properties.
	var e = o.getElementsByTagName("embed")[0];

	var r = e.src.match(oytre);
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
