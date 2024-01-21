"use strict";
let audioContext;
let analyser;
let source;
let dataArray;
let percentageDisplay;
let body = document.getElementById('body');
const box = document.getElementById('box');
function setupFileInput() {
    const fileInput = document.getElementById('audioFileInput');
    fileInput.addEventListener('change', handleFile);
}
function handleFile(event) {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
        loadAudio(file);
    }
}
function loadAudio(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            startPlayback(buffer);
        });
    };
    reader.readAsArrayBuffer(file);
}
function startPlayback(buffer) {
    source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start();
    updatePercentage();
}
function updatePercentage() {
    analyser.getByteFrequencyData(dataArray);
    const averageFrequency = getAverageFrequency();
    const maxFrequency = 255;
    const percentage = (averageFrequency / maxFrequency) * 100;
    percentageDisplay.innerText = `Percentage: ${percentage.toFixed(2)}%`;
    const rgbValue = Math.floor(percentage);
    box.style.border = `${rgbValue}px solid rgb(${rgbValue}, ${(rgbValue / 100) * 255}, ${rgbValue})`;
    box.style.scale = `${rgbValue}%`;
    setTimeout(updatePercentage, 50);
}
function getAverageFrequency() {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    return sum / dataArray.length;
}
window.addEventListener('DOMContentLoaded', () => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    percentageDisplay = document.getElementById('percentageDisplay');
    setupFileInput();
});
//# sourceMappingURL=script.js.map