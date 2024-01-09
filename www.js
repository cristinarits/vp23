const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');   //  fs - file system
const dateTime = require('./datetime_fnc');
const semesTer = require('./semesterprog');
const pageHead = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="utf-8"><title>Cristina Rits, veebiprogrammeerimine 2023</title></head><body>';
const pageBanner = '<img src="banner.png" alt="Kursuse banner">';
const pageBody = '\n\t<h1>Cristina Rits</h1>\n\t<p>See veebileht on valminud <a href="https://www.tlu.ee" target="_blank">TLU</a> Digitehnoloogiate instituudi informaatia eriala oppetoo raames.</p>';
const pageFoot = '\n\t<hr>\n\t</body>\n\t</html>';
const querystring = require('querystring');

http.createServer(function(req, res){
	let currentURL = url.parse(req.url, true);
	//console.log(currentURL);
	if(req.method === 'POST'){
		
		collectRequestData(req, result => {
            //console.log(result);
			let notice = '<p>Sisestatud andmetega tehti midagi!</p>';
			//kirjutame andmeid tekstifaili
			fs.open('txtfiles/log.txt', 'a', (err, file)=>{
				if(err){
					throw err;
				}
				else {
					fs.appendFile('txtfiles/log.txt', result.firstNameInput + ' ' + result.lastNameInput + ', ' + dateTime.dateENShort() + ';', (err)=>{
						if(err){
							throw err;
						}
						else {
							//console.log('faili kirjutati!');
							notice = '<p>Sisestatud andmete salvestamine õnnestus!</p>';
							nameAddedNotice(res, notice);
						}
					});
				}
			});
		});
	}
    else if (currentURL.pathname === '/'){
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(pageHead);
        res.write(pageBanner);
        res.write(pageBody);
        res.write('<hr><p>Lehe avamisel oli kell ' + dateTime.timeENformatted() + '. Praegu on ' + dateTime.timeOfDayET() + '</p>');
        res.write('<p>Täna on ' + dateTime.dateETformatted() + ', ' + dateTime.timeOfDayET() + '</p>');
        res.write('<hr><p><a href="addname">Lisa oma nimi</a></p>');
        res.write('<p><a href="listnames">Sisestatud nimed </a>:3</p>');
        res.write('<hr><p><a href="semesterprogress">Infot 2023 sügissemestri kohta</a></p>');
        res.write('<p><a href="tluphoto">Pilt Tallinna Ülikoolist</a></p>');
        res.write(pageFoot);
        return res.end();
    }

        //  Lisa oma nimi leht
    else if (currentURL.pathname === "/addname"){
        res.writeHead(200, {"Content-type": "text/html"});
        res.write(pageHead);
        res.write(pageBanner);
        res.write(pageBody);
        res.write('<hr><h2>Lisa palun oma nimi</h2>');
        res.write('<form method="POST"><label for="firstNameInput">Eesnimi: </label><input type="text" name="firstNameInput" id="firstNameInput" placeholder="Sinu eesnimi ..."><br><label for="lastNameInput">Perekonnanimi: </label><input type="text" name="lastNameInput" id="lastNameInput" placeholder="Sinu perekonnanimi ..."><br><input type="submit" name="nameSubmit" value="Salvesta"></form>');
		res.write('<p><a href="/">Avaleht</a></p>');
        res.write(pageFoot);
        return res.end();
    }

    else if (currentURL.pathname === "/listnames"){
			let htmlOutput = '\n\t<p>Kahjuks ühtegi nime ei leitud</p>';
			fs.readFile("txtfiles/log.txt", "utf8", (err, data)=>{
				if(err){
					console.log(err);
					listAllNames(res, htmlOutput);
				}
				else {
					//console.log(data);
					let allData = data.split(";");
					let allNames = [];
					htmlOutput = '\n\t<ul>';
					for (person of allData){
						allNames.push(person.split(',')); 
					}
					//console.log(allNames);
					for (person of allNames){
						if(person[0]){
							htmlOutput += '\n\t\t<li>' + person[0] + ' ' + person[1] + ', salvestatud: ' + person[2] + '</li>';
						}
					}
					htmlOutput += '\n\t</ul>'
					listAllNames(res, htmlOutput);
				}
			});
		}

       //  TLU pildi leht
    else if (currentURL.pathname === '/tluphoto'){
        let htmlOutput = '<p>Pilti ei saa näidata!</p>';
        let listOutput = '';
        fs.readdir('public/tluphoto', (err, fileList)=>{
            if(err){
                throw err;
            }
            else {
                //console.log(fileList)     // kontrolli fileListi fotodest
                let photoNum = Math.floor(Math.random() * fileList.length); // fileList.length - kasutab olemasolevat listi pikkust
                htmlOutput = '<img src="' + fileList[photoNum] + '" alt="TLU pilt">';
                listOutput = '<ul>';
                for (fileName of fileList){
                    listOutput += '<li>' + fileName + '</li>';
                }
                listOutput += '</ul>'
                tluPhotoPage(res, htmlOutput, listOutput);
            }
        });

    }
    else if (currentURL.pathname === '/semesterprogress'){
        res.writeHead(200, {'Content-type': 'text/html'});
        res.write(pageHead);
        res.write(pageBanner);
        res.write(pageBody);
        res.write('<p>' + semesTer.output + '</p>');
        res.write('<p><a href="/">Avaleht</a></p>');
        res.write(pageFoot);
        return res.end();

    }
    else if (currentURL.pathname === '/banner.png'){
        //console.log('Tahame bannerit!');
        let bannerPath = path.join(__dirname, 'public', 'banner');
        fs.readFile(bannerPath + currentURL.pathname, (err, data)=>{
            if (err){
                throw err;
            }
            else {
                res.writeHead(200, {'Content-type': 'image/png'});
                res.end(data);
            }
        });

    } 

    else if (path.extname(currentURL.pathname) === ".jpg"){
		console.log(path.extname(currentURL.pathname));
		//let filePath = path.join(__dirname, "public", "tluphoto/tlu_42.jpg");
		let filePath = path.join(__dirname, "public", "tluphoto");
		fs.readFile(filePath + currentURL.pathname, (err, data)=>{
			if(err){
				throw err;
			}
			else {
				res.writeHead(200, {"Content-Type": "image/jpeg"});
				res.end(data);
			}
		});
	} 
    else {
        res.end('ERROR 404');
    }
    //valmis, saada ara
}).listen(5196);

// Function to tluPhotoPage
function tluPhotoPage(res, htmlOutput, listOutput){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(pageHead);
    res.write(pageBanner);
    res.write(pageBody);
    res.write(htmlOutput);
    res.write('<p><a href="/">Avaleht</a></p>');
    if(listOutput != ''){
        res.write(listOutput);
    }
    res.write(pageFoot);
    return res.end();
}

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let receivedData = '';
        request.on('data', chunk => {
			console.log(chunk);
            receivedData += chunk.toString();
        });
        request.on('end', () => {
			console.log(receivedData);
            callback(querystring.decode(receivedData));
        });
    }
    else {
        callback(null);
    }
}

function nameAddedNotice(res, notice){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<h2>Palun lisa oma nimi</h2>');
	res.write('\n\t' + notice);
	res.write('\n\t <p><a href="/addName">Sisestame järgmise nime</a>!</p>');
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(pageFoot);
	//et see kõik valmiks ja ära saadetaks
	return res.end();
}

function listAllNames(res, htmlOutput){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write(pageHead);
	res.write(pageBanner);
	res.write(pageBody);
	res.write('\n\t<h2>Kõik sisestatud nimed</h2>');
	res.write(htmlOutput);
	res.write('\n\t <p><a href="/">Tagasi avalehele</a>!</p>');
	res.write(pageFoot);
	//et see kõik valmiks ja ära saadetaks
	return res.end();
}

/*function dataToList() {
    let sortedData = data.split(";");
    for (let i = 0; i < sortedData.length; i++) {
        dataList += '<li>' + sortedData[i] + '</li>';
    }
    return dataList;
}*/

//KODUS: peab tegema lehe selliseks, et tekstifaili salvestatakse nt "eesnimi, perekonnanimi,kuupäev millal inimene salvestas", tuleb date muuta eestipäraseks (vanasõnade splittimise järgi sqaab teha, võib tulla massiiv kus sees on veel massiiv, names[0],names[1]-> perekonnanimi[0][1])

	
	//valmis, saada ara

//cririts    5196

