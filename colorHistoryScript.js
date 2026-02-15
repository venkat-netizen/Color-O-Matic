//All the elements used for this page.
const backButton = document.getElementById('backButton');
const historyWindow = document.getElementById('historyWindow');

let existingColorHistory = JSON.parse(localStorage.getItem('color-history')) || [];



backButton.addEventListener('click', () => {
window.location.href = "index.html";
})


historyWindow.innerHTML = '';

//Build and append one color entry + text from history.
for (const entry of existingColorHistory) {


    const colorEntry = document.createElement('div');
    colorEntry.className = 'colorEntry';
    colorEntry.style.backgroundColor = entry.hex;


    const colorEntryText = document.createElement('div');
    colorEntryText.className = 'colorEntryText';
    colorEntryText.textContent = `${entry.colorName.toUpperCase()} (${entry.hex.toUpperCase()})`

    colorEntry.appendChild(colorEntryText);
    historyWindow.appendChild(colorEntry);

}