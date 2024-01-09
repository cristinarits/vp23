const firstName = "Cristina";
const lastName = "Rits";
const datetimeValue = require("./dateTime_et");
const fs = require("fs");
//let folkWisdom = [];

fs.readFile("txtfiles/vanasonad.txt", "utf8", (err, data)=>{
	if(err){
		console.log(err);
	}
	else {
		//console.log(data);
		//folkWisdom = data;
		onScreen(data);
	}
});//readFile lõppeb

const onScreen = function(){
	console.log(firstName + " " + lastName);
	console.log("Täna on " + datetimeValue.dateETformatted());
	//console.log(folkWisdom);
	let folkWisdoms = folkWisdom.split(";");
	//console.log(folkWisdoms);
	//console.log(folkWisdoms.length);
	//console.log("Tänane tarkus: " + folkWisdoms[Math.floor(Math.random() * folkWisdoms.length)]);
	//kõige tavalisem for tsükkel (loop)
	for (let i = 0; i < folkWisdoms.length; i ++){
		console.log("Vanasõna nr " + (i + 1) + ': "' + folkWisdoms[i] + '"');
	}
	console.log("Kell on: " + dateInfo.timeNowET());
	console.log("On " + dateInfo.timeOfDayET() + ".");
	//console.log(datetimeValue.monthsET);
}

//let dateETNow = dateValue.dateETformatted();
//console.log("Täna on: " + dateETNow);
//selleks et järjekorda saada õigeks võid panna console logid funktsiooni sisse, enne on lis faililugemine
