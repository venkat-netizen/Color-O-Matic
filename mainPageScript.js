import colorsList from './colorsList.js';

//All the elements used for this page.
const hexBox = document.getElementById('hexBox');
const colorName = document.getElementById('colorName');
const infoSide = document.getElementById("infoSide");
const freezeButton = document.getElementById('freezeButton');
const showHistoryButton = document.getElementById('showHistoryButton');
const canvas = document.getElementById('canvas');



const context = canvas.getContext('2d');

//The key for accessing the history and max number of colors allowed in the history page.
const COLOR_HISTORY_KEY = "color-history";
const MAX_COLOR_HISTORY = 20;

//The number that determines the area that will be processed for the color.
const RANGE_COLOR_IDENTIFICATION = 40;
const xValue = Math.floor((canvas.width / 2) - (RANGE_COLOR_IDENTIFICATION / 2));
const yValue = Math.floor((canvas.height / 2) - (RANGE_COLOR_IDENTIFICATION / 2));

let isFrozen = false;
let existingColorHistory = JSON.parse(localStorage.getItem(COLOR_HISTORY_KEY)) || [];

let lastHex = null;
let lastColorName = null;
let video = document.querySelector('#liveVideo');


//Start (back) camera, show it in video and start renderFrames
navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
    .then(function(stream) {
        video.srcObject = stream;

        requestAnimationFrame(renderFrames);
    });

//Freeze button code.
freezeButton.addEventListener('click', () => {
    isFrozen = !isFrozen;

    if (isFrozen) {
        freezeButton.textContent = 'UNFREEZE';
        addToColorHistory(lastHex, lastColorName);
    } else {
        freezeButton.textContent = 'FREEZE / SAVE';
        renderFrames();

    }


});


//Show history button code. Goes to next page.
showHistoryButton.addEventListener('click', () => {
        window.location.href = "colorHistory.html";
});


//Samples the square area for its color and updates the UI. Then restarts.
function renderFrames() {

    if (isFrozen) return;

    context.drawImage(video, 0, 0);

    context.strokeRect(xValue, yValue, RANGE_COLOR_IDENTIFICATION, RANGE_COLOR_IDENTIFICATION);

    const processingData = context.getImageData(xValue, yValue, RANGE_COLOR_IDENTIFICATION, RANGE_COLOR_IDENTIFICATION).data;
    const rgb = getRgb(processingData);

    const hexText = getHexFromRgb(rgb)
    const colorNameText = getColorFromRgb(rgb);

    hexBox.textContent = hexText.toUpperCase();
    colorName.textContent = colorNameText.toUpperCase();
    infoSide.style.backgroundColor = hexText;


    lastHex = hexText;
    lastColorName = colorNameText;

    requestAnimationFrame(renderFrames);
}


//Averages all the RGB values of the pixels in the sample area.
function getRgb(processingData) {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let x = 0; x < processingData.length; x+=4) {

        r += processingData[x];
        g += processingData[x + 1];
        b += processingData[x + 2];
    }

    r = Math.round(r / (RANGE_COLOR_IDENTIFICATION * RANGE_COLOR_IDENTIFICATION));
    g = Math.round(g / (RANGE_COLOR_IDENTIFICATION * RANGE_COLOR_IDENTIFICATION));
    b = Math.round(b / (RANGE_COLOR_IDENTIFICATION * RANGE_COLOR_IDENTIFICATION));


    return [r, g, b];

}


//Gets the hex value from RGB
function getHexFromRgb(rgb) {
   return  '#' + rgb[0].toString(16).padStart(2, '0') +
       rgb[1].toString(16).padStart(2, '0') +
       rgb[2].toString(16).padStart(2, '0');
}


//Finds the closest named color from the colorsList by comparing RGB distance
function getColorFromRgb(rgb) {

    let smallestDistance = Infinity;
    let closestColorName = "";

    for (const key in colorsList) {

        const [r, g, b] = colorsList[key].rgb;

        const distR = rgb[0] - r;
        const distG = rgb[1] - g;
        const distB = rgb[2] - b;

        const distance = (distR * distR) + (distG * distG) + (distB * distB);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestColorName = colorsList[key].name;
        }
    }

    return closestColorName;

}


//Adds a new color entry to the history, if color was saved.
function addToColorHistory(hex, colorName) {
    const colorEntry = {
        colorName: colorName,
        hex: hex,
    };

    existingColorHistory.unshift(colorEntry);

    if (existingColorHistory.length > MAX_COLOR_HISTORY) {
        existingColorHistory.pop();
    }

    localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(existingColorHistory));
}



