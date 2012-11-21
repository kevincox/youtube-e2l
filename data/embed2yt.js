var ytre = new RegExp("^(https?://)(www\\.)?youtube(-nocookie)?.com/embed/([^/?#]*).*$","i");

var framesel = document.getElementsByTagName("iframe");

var frames = [];
for ( i in framesel )         // When we removed the frames element list they
	frames.push(framesel[i]); // disappear from the list causing index errors.

for ( i in frames )
{
	let f = frames[i];
	var r = f.src.match(ytre);
	if (r)
	{
		let vid = r[4];

		let tn = document.createElement("a");
		tn.href = self.options.pref.url.replace("%vid%", vid);

		tn.className = "embed2yt";
		tn.style.display = "block";
		tn.style.width  = f.width + "px";
		tn.style.height = f.height + "px";

		f.parentNode.insertBefore(tn, f);
		f.parentNode.removeChild(f);

		let req = new XMLHttpRequest();
		console.log('https://gdata.youtube.com/feeds/api/videos/'+vid+'?v=2&alt=jsonc')
		req.open('GET', 'https://gdata.youtube.com/feeds/api/videos/'+vid+'?v=2&alt=jsonc');
		req.responseType = "json";
		req.onload = function(e) {
			tn.textContent = req.response.data.title;

			tn.style.backgroundImage = "url("+self.options.playIcon+")," +
			                           "url("+req.response.data.thumbnail[self.options.pref.thumbnailQuality]+")";
		};
		req.send();
	}
}
