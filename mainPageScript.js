import colorsList from './colorsList.js';

const hexBox = document.getElementById('hexBox');
const colorName = document.getElementById('colorName');
const freezeButton = document.getElementById('freezeButton');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const colorHistoryKey = "color-history";
const maxColorHistory = 20;

const range = 40;
const xValue = Math.floor((canvas.width / 2) - (range / 2));
const yValue = Math.floor((canvas.height / 2) - (range / 2));

let isFrozen = false;
let colorHistory = JSON.parse(localStorage.getItem(colorHistoryKey)) || [];

let lastHex = null;
let lastColorName = null;

const showHistoryButton = document.getElementById('showHistoryButton');


let video = document.querySelector('#liveVideo');

navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
    .then(function(stream) {
        video.srcObject = stream;

        requestAnimationFrame(frames);
    });


freezeButton.addEventListener('click', () => {
    isFrozen = !isFrozen;

    if (isFrozen) {
        freezeButton.textContent = 'UNFREEZE';
        addToColorHistory(lastHex, lastColorName);
    } else {
        freezeButton.textContent = 'FREEZE';
        frames();

    }


});

showHistoryButton.addEventListener('click', () => {
        window.location.href = "colorHistory.html";
});

function frames() {

    if (isFrozen) return;

    context.drawImage(video, 0, 0);

    context.strokeRect(xValue, yValue, range, range);

    const processingData = context.getImageData(xValue, yValue, range, range).data;
    const rgb = getRgb(processingData);

    const hex = getHexFromRgb(rgb)
    const colorNameText = getColorFromRgb(rgb);

    hexBox.textContent = hex;
    hexBox.style.backgroundColor = hex;
    colorName.textContent = colorNameText;

    lastHex = hex;
    lastColorName = colorNameText;

    requestAnimationFrame(frames);
}

function getRgb(processingData) {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let x = 0; x < processingData.length; x+=4) {

        r += processingData[x];
        g += processingData[x + 1];
        b += processingData[x + 2];
    }

    r = Math.round(r / (range * range));
    g = Math.round(g / (range * range));
    b = Math.round(b / (range * range));


    return [r, g, b];

}

function getHexFromRgb(rgb) {
   return  '#' + rgb[0].toString(16).padStart(2, '0') +
       rgb[1].toString(16).padStart(2, '0') +
       rgb[2].toString(16).padStart(2, '0');
}

function getColorFromRgb(rgb) {

    let minDistance = Infinity;
    let colorName = "";

    for (const key in colorsList) {

        const [r, g, b] = colorsList[key].rgb;

        const distR = rgb[0] - r;
        const distG = rgb[1] - g;
        const distB = rgb[2] - b;

        const distance = (distR * distR) + (distG * distG) + (distB * distB);

        if (distance < minDistance) {
            minDistance = distance;
            colorName = colorsList[key].name;
        }
    }

    return colorName;

}

function addToColorHistory(hex, colorName) {
    const colorEntry = {
        colorName: colorName,
        hex: hex,
        time: new Date().toLocaleTimeString()
    };

    colorHistory.unshift(colorEntry);

    if (colorHistory.length > maxColorHistory) {
        colorHistory.pop();
    }

    localStorage.setItem(colorHistoryKey, JSON.stringify(colorHistory));
}



