const electron = require("electron");
const images = require("./images");
const menuTempalte = require("./menu");
const { app, BrowserWindow, ipcMain: ipc, Menu } = electron;

let mainWindow;
app.on("ready", () => {
	mainWindow = new BrowserWindow({
		width: 893,
		height: 775,
		resizable: false
	});

	mainWindow.loadURL(`file://${__dirname}/capture.html`);
	
	images.mkdir(images.getPicturesDir(app));
	
	app.on("closed", () => {
		mainWindow = null;
	});

	const menuContents = Menu.buildFromTemplate(menuTempalte(mainWindow));
	Menu.setApplicationMenu(menuContents);
});

ipc.on("image-capture", (event, contents) => {
	images.save(images.getPicturesDir(app), contents, (err, imgPath) => {
		images.cache(imgPath);
	});
});

ipc.on("image-remove", (e, i) => {
	console.log();
	
	images.rm(i, _ => {
		console.log(e.sender.send, "SENDER!");
		
		e.sender.send("image-removed", i);
	});
});

exports.images = images;