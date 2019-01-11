const video = require("./video");
const countdown = require("./countdown.js");
const flash = require("./flash");
const electron = require("electron");
const effects = require("./effects");
const { ipcRenderer: ipc, shell, remote } = electron;

const images = remote.require("./images");

let canvasTarget;
let seriously;
let videoSrc;


const formatImageTag = (doc, bytes) => {
	const div = doc.createElement("div");
	div.classList.add("photo");
	const close = doc.createElement("div");
	close.classList.add("photoClose");
	const img = new Image();
	img.classList.add("photoImg");
	img.src = bytes;
	div.appendChild(img);
	div.appendChild(close);
	
	return div;
};   

window.addEventListener("DOMContentLoaded", () => {
	const videoEl = document.getElementById("video");
	const canvasEl = document.getElementById("canvas");
	const recordEl = document.getElementById("record");
	const photosEl = document.querySelector(".photosContainer");
	const counterEl = document.getElementById("counter");
	const flashEl = document.getElementById("flash");
    
	// const ctx = canvasEl.getContext("2d");
	seriously = new Seriously();
	videoSrc = seriously.source("#video");
	canvasTarget = seriously.target("#canvas");
	effects.choose(seriously, videoSrc, canvasTarget);

	video.init(navigator, videoEl);
    
	recordEl.addEventListener("click", _ => {
		countdown.start(counterEl, 1, _ =>{
			flash(flashEl);
			let bytes = video.captureBytesFromLiveCanvas(canvasEl);
			ipc.send("image-capture", bytes);
			photosEl.appendChild(formatImageTag(document, bytes));
		});
		
	});

	photosEl.addEventListener("click", e => {
		const isRm = e.target.classList.contains("photoClose");
		const selector = isRm ? ".photoClose" : ".photoImg";
		const photos = Array.from(document.querySelectorAll(selector));
		const index = photos.findIndex(el => el == e.target);
		
		if(index > -1){
			if(isRm){
				ipc.send("image-remove", index);
			} else {
				// after photo is deleted, images dont "re-index"
				shell.showItemInFolder(images.getFromCache(index));
			}
		}
	});
});

ipc.on("image-removed", (e, i) => {
	document.getElementById("photos").removeChild(Array.from(document.querySelectorAll(".photo"))[i]);
});

ipc.on("effect-choose", (e, effectName) => {
	console.log(effectName, "in capture");
	
	effects.choose(seriously, videoSrc, canvasTarget, effectName);
});

ipc.on("effect-cycle", evt => {
	effects.cycle(seriously, videoSrc, canvasTarget);
}); 