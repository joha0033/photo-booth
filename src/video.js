const constraints = {
	audio: false,
	video: {
		madatory: {
			minWidth: 853,
			minHeight: 480,
			maxWidth: 853,
			maxHeight: 480
		}

	}
};

const handleSuccess = (videoEl, stream) => {
	console.log("success called");
	videoEl.src = window.URL.createObjectURL(stream);
};

const handleError = (error) => {
	console.log("Error with video stream:", error);
};

exports.init = (nav, videoEl) => {
	nav.getUserMedia = nav.webkitGetUserMedia;
	nav.getUserMedia(constraints, stream => handleSuccess(videoEl, stream), handleError);
};

// exports.captureBytes = (videoEl, ctx, canvasEl) => {
// 	ctx.drawImage(videoEl, 0, 0);
// 	return canvasEl.toDataURL("image/png");
// };

exports.captureBytesFromLiveCanvas = canvas => {
	// ctx.drawImage(videoEl, 0, 0);
	return canvas.toDataURL("image/png");
};