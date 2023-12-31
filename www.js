const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const pageHead = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="utf-8"><title>Cristina Rits, veebiprogrammeerimine 2023</title></head><body>';
const pageBanner = '\n\t<img src="public/banner.png" alt="kursuse banner">'
const pageBody = '\n\t<h1>Cristina Rits</h1>\n\t<p>See veebileht on valminud <a href="https://www.tlu.ee" target="_blank">TLU</a> Digitehnoloogiate instituudi informaatia eriala oppetoo raames.</p>';
const pageFoot = '\n\t<hr>\n\t</body>\n\t</html>';

http.createServer(function(req, res){
	let currentURL = url.parse(req.url, true);
	//console.log(currentURL);
    if (currentURL.pathname === "/"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<hr>\n\t<p><a href="addname">Lisa oma nimi</a>!</p>');
		res.write(pageFoot);
		//console.log("Keegi vaatab!");
		return res.end();
		}
	
	else if (currentURL.pathname === "/addname"){
		res.writeHead(200, {"Content-type": "text/html"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<hr>\n\t<h2>Lisa palun oma nimi</h2>');
		res.write('\n\t<p>Edaspidi lisame siia asju!</p>');
		res.write(pageFoot);
		return res.end();
	}
	
	else if (currentURL.pathname === "/banner.png"){
		console.log("Tahame pilti!");
		let bannerPath = path.join(__dirname, "public", "banner/banner.png");
		//console.log(bannerPath + currentURL.pathname);
		fs.readFile(bannerPath + currentURL.pathname, (err, data)=>{
			if (err) {
				throw err;
			}
			else {
				console.log("Tuli ara!");
				res.writeHead(200, {"Content-type": "image/png"});
				res.end(data);
		}
		});
	}
	else {
		res.end("ERROR 404");
	}
	//valmis, saada ara
}).listen(5197);

//cririts    5197

