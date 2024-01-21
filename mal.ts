let audioContext: AudioContext;
let analyser: AnalyserNode;
let source: AudioBufferSourceNode;
let dataArray: Uint8Array;
let percentageDisplay: HTMLDivElement;

function setupFileInput() {
	const fileInput = document.getElementById('audioFileInput') as HTMLInputElement;
	fileInput.addEventListener('change', handleFile);
}

function handleFile(event: Event) {
	const fileInput = event.target as HTMLInputElement;
	const file = fileInput.files?.[0];

	if (file) {
		loadAudio(file);
	}
}

function loadAudio(file: File) {
	const reader = new FileReader();

	reader.onload = (e: ProgressEvent<FileReader>) => {
		const arrayBuffer = e.target?.result as ArrayBuffer;

		audioContext.decodeAudioData(arrayBuffer, (buffer) => {
			startPlayback(buffer);
		});
	};

	reader.readAsArrayBuffer(file);
}

function startPlayback(buffer: AudioBuffer) {
	source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(analyser);
	analyser.connect(audioContext.destination);
	source.start();

	updatePercentage();
}

function updatePercentage() {
	analyser.getByteFrequencyData(dataArray);

	// Calculate the average frequency
	const averageFrequency = getAverageFrequency();

	// Normalize the frequency to a percentage (assuming some maximum frequency)
	const maxFrequency = 255; // Adjust this based on your audio data characteristics
	const percentage = (averageFrequency / maxFrequency) * 100;

	// Display the percentage
	percentageDisplay.innerText = `Percentage: ${percentage.toFixed(2)}%`;

	// Call the update function again after a short interval
	setTimeout(updatePercentage, 100); // Adjust the interval as needed
}

function getAverageFrequency() {
	let sum = 0;
	for (let i = 0; i < dataArray.length; i++) {
		sum += dataArray[i];
	}
	return sum / dataArray.length;
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', () => {
	audioContext = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioContext.createAnalyser();
	analyser.fftSize = 256;
	dataArray = new Uint8Array(analyser.frequencyBinCount);
	percentageDisplay = document.getElementById('percentageDisplay') as HTMLDivElement;

	setupFileInput();
});