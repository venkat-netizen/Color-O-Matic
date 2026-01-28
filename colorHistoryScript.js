const backButton = document.getElementById('backButton');
const historyWindow = document.getElementById('historyWindow');

let colorHistory = JSON.parse(localStorage.getItem('color-history')) || [];



backButton.addEventListener('click', () => {
window.location.href = "index.html";
})


historyWindow.innerHTML = '';

let colorDate;
for (const entry of colorHistory) {

    //row
    const row = document.createElement('div');
    row.className = 'colorEntryRow';
    row.style.backgroundColor = entry.hex;

    //actual color
    const colorPicture = document.createElement('div');
    colorPicture.className = 'ColorEntryPicture';


    //text
    const text = document.createElement('div');
    text.className = 'ColorEntryName';

    const colorTimeInformation = new Date(entry.time);
    const date = colorTimeInformation.toLocaleDateString();
    const time = colorTimeInformation.toLocaleTimeString();


    text.textContent =
        `${entry.colorName.toUpperCase()} (${entry.hex.toUpperCase()}) on ${date} at ${time}`;


    row.appendChild(colorPicture);
    row.appendChild(text);
    historyWindow.appendChild(row);
}