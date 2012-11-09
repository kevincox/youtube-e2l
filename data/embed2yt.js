var ytre = new RegExp("(https?://)(www\\.)?youtube.com/embed/([^/]*)","i");

var framesel = document.getElementsByTagName("iframe");

var frames = [];
for ( i in framesel )         // When we removed the frames element list they
    frames.push(framesel[i]); // disappear from the list causing index errors.

self.port.on("gotData", function (data)
{
    for ( i in frames )
    {
        let f = frames[i];
        var r = f.src.match(ytre);
        if (r)
        {
            let ptl = r[1];
            let www = r[2];
            let vid = r[3];
            
            let tn = document.createElement("a");
            tn.href = ptl+"youtu.be/"+vid;
            let req = new XMLHttpRequest();
            req.open('GET', 'https://gdata.youtube.com/feeds/api/videos/'+vid+'?v=2&alt=jsonc');
            req.responseType = "json";
            req.onload = function(e) {
                //console.log(req.response);
                tn.innerHTML = req.response.data.title;
            
                tn.className = "embed2yt";
                tn.style.display = "block";
                tn.style.width  = f.width + "px";
                tn.style.height = f.height + "px";
                tn.style.backgroundImage = "url("+data.playIcon+")," +
                                           "url("+req.response.data.thumbnail.hqDefault+")";
                
                f.parentNode.insertBefore(tn, f);
                f.parentNode.removeChild(f);
            };
            req.send();
        }
    }
});