var bunyan = require('bunyan'),
	logger = bunyan.createLogger({name: "db"}),
	mongodb = require('mongodb');

// db
var init = function(connStr, callback) {
	logger.info("attempting to connect to db: " + connStr);
	var client = mongodb.MongoClient;
	var db = client.connect(connStr, function(err, db) {
		if(err) {
			logger.error("error connecting to mongo! "+err);
			callback({ "code": 1, "error": err });
			return;
		}

		db.createCollection('messages', function(err, db){});
		callback({ "code": 0, "error": "" });
	});
}

module.exports = {
	"init": init	
};
