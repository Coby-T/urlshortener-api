var express = require("express");
var app = express();
var mongo = require('mongodb').MongoClient;
var api = require("./api/url-shortener.js");
var path = require('path');

var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener';
var port = process.env.PORT || 8080;

mongo.connect(url, function(err, db) {
    
    if (err) {
        throw new Error("Could not connect to database");
    }
    else {
        console.log("Successfully connected to the database");
    }
    
    db.createCollection('websites', {
        capped: true,
        size: 5242880,
    });

    api(app, db, path);

    app.listen(port, function() {
        console.log('Node.js listening on port ' + port);
    });
})