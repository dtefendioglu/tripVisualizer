var bunyan = require('bunyan'),
	logger = bunyan.createLogger({name: "db"}),
	mongodb = require('mongodb');

var globalDB = null;
var init = function(config, callback) {
	var connStr = "mongodb://" + config.host + ":" + config.port + "/" + config.name;
	logger.info("attempting to connect to db: " + connStr);
	var client = mongodb.MongoClient;
	client.connect(connStr, function(err, db) {
		if(err) {
			logger.error("error connecting to mongo! "+err);
			callback({ "code": 1, "error": err });
			globalDB = null;
			return;
		}

		globalDB = db;
		db.createCollection('messages', function(err, db){});
		callback({ "code": 0, "error": "" });
	});
}

module.exports = {
	"init": init	
};
