'use-strict';

module.exports = function (app, db, path) {
    
    app.get('/', function(req, res) {
        var guidePath = path.join(__dirname, "index.html");
        res.sendFile(guidePath, function (err) {
            if (err) {
                throw err;
            }
            else {
                console.log("Readme sent");
            }
        });
    });
    
    app.get('/', function(req, res) {
        res.send("Error: Please provide a proper URL to shorten");
    });
    
    app.get('/:shortUrl', function(req, res) {
        
        console.log("Retrieving URL redirect for " + req.params.shortUrl);
        
        var shortUrl = req.params.shortUrl;
        if (shortUrl != "favicon.ico" || shortUrl != "index.css"){
            var websites = db.collection('websites');
            websites.findOne({
                shortURL: shortUrl
            }, function (err, result) {
                if (err) throw err;
                if (result) {
                    res.redirect(result.fullURL);
                }
                else {
                    res.send("Error: Could not find a matching URL in our database.");
                }
            });
        }
    });
    
    app.get('/new/:fullUrl(*)', function(req, res) {
        
        console.log("Shortening URL for " + req.params.fullUrl);
        
        if (validUrl(req.params.fullUrl)) {
            var urlObj = {};
            var websites = db.collection('websites');
            // Generate random link generator
            var shortUrlString = "";
            for (var i = 0 ; i < 4 ; i++) {
                var random1 = Math.floor(Math.random()*3);
                var random2 = Math.random();
                if (random1) {
                    random2 = Math.floor(random2*26);
                    shortUrlString += String.fromCharCode(32*random1+33+random2);
                }
                else {
                    random2 = Math.floor(random2*10);
                    shortUrlString += random2;
                }
            }
            urlObj = {
                shortURL: shortUrlString,
                fullURL: req.params.fullUrl
            };
            websites.save(urlObj);
            res.json({
                shortURL: process.env.APP_URL + shortUrlString,
                fullURL: req.params.fullUrl
            });
        }
        else {
            res.send("Error: please input a proper url.");
        }
    });
    
    function validUrl(url) {
        var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regex.test(url);
    }
    
};