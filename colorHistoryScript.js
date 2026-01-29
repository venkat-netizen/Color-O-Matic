const backButton = document.getElementById('backButton');
const historyWindow = document.getElementById('historyWindow');

let existingColorHistory = JSON.parse(localStorage.getItem('color-history')) || [];



backButton.addEventListener('click', () => {
window.location.href = "index.html";
})


historyWindow.innerHTML = '';

for (const entry of existingColorHistory) {

    //row
    const colorEntry = document.createElement('div');
    colorEntry.className = 'colorEntry';
    colorEntry.style.backgroundColor = entry.hex;

    const entryTimeStamp = new Date(entry.timestamp);
    const timeStampText = entryTimeStamp.toLocaleString();
    //text
    const colorEntryText = document.createElement('div');
    colorEntryText.className = 'colorEntryText';
    colorEntryText.textContent = `${entry.colorName.toUpperCase()} (${entry.hex.toUpperCase()}) at ${timeStampText} `

    colorEntry.appendChild(colorEntryText);
    historyWindow.appendChild(colorEntry);

}