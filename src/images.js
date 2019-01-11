const fs = require("fs");
const path = require("path");
const { shell } = require("electron");
const { spawn } = require("child_process");
let images = [];

const logErr = (err) => console.log("error writing image to directoy", err);


exports.save = (picturesPath, contents, done) => {
	const base64Data = contents.replace(/^data:image\/png;base64,/, " ");
	const imgPath = path.join(picturesPath, `${new Date().getTime()}.png`);
	fs.writeFile(imgPath, base64Data, { encoding: "base64" }, err => {
		if(err) logErr(err);
		
		done(null, imgPath);
	});
};

exports.getPicturesDir = (app) => {
	return path.join(app.getPath("pictures"), "photos2");
};

exports.mkdir = picturesPath => {
	fs.stat(picturesPath, (err, stats) => {
		if(err && err.code !== "ENOENT")
			return logErr(err);
		else if (err || !stats.isDirectory())
			fs.mkdir(picturesPath, logErr);
	});
};

exports.cache = imgPath => {
	images = images.concat([imgPath]);
	return images;
};

exports.getFromCache = (index) => {
	return images[index];
};

exports.rm = (index, done) => {
	fs.unlink(images[index], err => {
		if(err) return logErr(err);

		images.splice(index, 1);
		done();
	});
};

const openCmd = {
	darwin: "open",
	win: "explorer",
	linux: "nautlus"
};
exports.openDir = dirPath => {
	const cmd = openCmd[process.platform];
	if(cmd){
		spawn(cmd, [ dirPath ]);
	} else {
		shell.showItemInFolder(dirPath);
	}
};