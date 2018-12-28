const constraints = {
	audio: false,
	video: {
		madatory: {
			minWidth: 853,
			minHeight: 400,
			maxWidth: 853,
			maxHeight: 400
		}

	}
};

const handleSuccess = (videoEl, stream) => {
	videoEl.src = window.URL.createObjectURL(stream);
};

const handleError = (error) => {
	console.log("Error with video stream:", error);
};

exports.init = (nav, videoEl) => {
	navigator.getUserMedia = navigator.webkitGetUserMedia;
	navigator.getUserMedia(constraints, stream => handleSuccess(videoEl, stream), handleError);
};

exports.captureBytes = (videoEl, ctx, canvasEl) => {
	ctx.drawImage(videoEl, 0, 0);
	return canvasEl.toDataURL("image/png");
};