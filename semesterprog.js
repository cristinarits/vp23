const semesterBegin = new Date('08/28/2023');   // semestri alguse kuupaev
const semesterEnd = new Date('01/28/2024');     // semestri lopu kuupaev
const today = new Date();                       // praegune kuupaev
let semesterLasted = Math.floor((today.getTime() - semesterBegin.getTime()) / 86.4e6);  // 1000 * 60 * 60 * 24 = 86.4e6
let semesterStill = Math.floor((semesterEnd.getTime() - today.getTime()) / 86.4e6);
let semesterNotStart = Math.floor((semesterBegin.getTime() - today.getTime()) / 86.4e6);
const semesterDuration = Math.floor((semesterEnd - semesterBegin) / 86.4e6);

const dateFormat = {day: 'numeric', month: 'long', year: 'numeric'};     // yldine format nt 28. august 2023)
const startFormat = semesterBegin.toLocaleDateString('et-EE', dateFormat);  // Eesti kuupaeva format
const endFormat = semesterEnd.toLocaleDateString('et-EE', dateFormat);

// semester kestab
if (semesterBegin <= today && today <= semesterEnd) {
    output = `
        <hr><p>Semester algas: ${startFormat}</p>
        <p>Semester lõpeb: ${endFormat}</p>
        <hr><p>Kokku kestab: ${semesterDuration} päeva</p>
        <p>läbitud on ${semesterLasted} päeva ja veel on ees ${semesterStill} päeva</p>
        <meter min="0" max="${semesterDuration}" value="${semesterLasted}"></meter>
    `;

}   // semester pole alanud veel
else if (semesterBegin > today){

    output = 'Semester pole alanud! Veel on aega ' + semesterNotStart + ' päeva!';

}   // semester on labi
else if (semesterEnd < today){

    output = 'Semester on kahjuks läbi!!!';
}
module.exports = {semesterBegin: semesterBegin, semesterEnd: semesterEnd, today: today, semesterLasted: semesterLasted, semesterStill: semesterStill, semesterNotStart: semesterNotStart, startFormat: startFormat, endFormat: endFormat, output: output};