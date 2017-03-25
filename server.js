// modules
var http = require('http'),
	bunyan = require('bunyan'),
	logger = bunyan.createLogger({name: "server"});
	express = require('express'),
	db = require('./db.js');

var initSuccess = true;

// config
var config = require('./config.json');
logger.info("config loaded");
logger.info(config);

// db init
var connStr = "mongodb://" + config.db.host + ":" + config.db.port + "/" + config.db.name;
db.init(connStr, function(ret) {
	if(ret.code !== 0)
		initSuccess = false;
});

// handlers
var helpHandler = require('./handlers/help.js');

// server routing
var app = express();
app.get("/", function(req, res, next) {
	res.send("blank page");
});

app.use("/help", helpHandler);

// LISTEN!
if(initSuccess) {
	logger.info("listening on %s", config.server.port);
	app.listen(config.server.port);
}
else
	logger.error("there was an init error, exiting");
