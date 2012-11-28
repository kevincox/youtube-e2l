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

var ytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/embed/([^/?#]*).*$","i");

var elements = [];
var framesel = document.getElementsByTagName("iframe");
for ( i in framesel )           // When we removed the frames element list they
	elements.push(framesel[i]); // disappear from the list causing index errors.

for ( i in elements )
{
	let f = elements[i];
	var r = f.src.match(ytre);
	if (r)
	{
		replaceWithThumbnail({
			id: r[4],
			replace: f,
			width:  f.width  + "px",
			height: f.height + "px",
		});
	}
}

var oytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/v/([^/?#]*).*$","i");

var elements = [];
var objectsel = document.getElementsByTagName("object");
for ( i in objectsel )           // When we removed the frames element list they
	elements.push(objectsel[i]); // disappear from the list causing index errors.

for ( i in elements )
{
	var o = elements[i];
	var e = o.getElementsByTagName("embed")[0];
	
	var r = e.src.match(oytre);
	if (r)
	{
		replaceWithThumbnail({
			id: r[4],
			replace: o,
			width:  o.width  + "px",
			height: o.height + "px",
		});
	}
};