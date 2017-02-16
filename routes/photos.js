/* jshint esversion: 6 */

var express = require('express');
var router = express.Router();

router.get('/:artistName', function(req, res, next)	{

	const artistName = req.params["artistName"];
	const results = [];
	const flickr_api = process.env.FLICKR_API_KEY;

	if(artistName == null) {
		name = req.body.artistName;
	}

	console.log("ARTIST NAME TO GO TO FLICKR", artistName);

	const url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickr_api + "&text=" + artistName + "+stage+concert&license=1&sort=relevance&content_type=1&media=photos&per_page=20&format=json&nojsoncallback=1";

	console.log("FLICKR URL", url);	
	const request = require("request");
	const async = require("async");

	request(url, function(error, response, body) {
		
		const data = JSON.parse(body);
		const photoList = data.photos.photo;

		async.eachSeries(photoList, function(photoList, callback) {
			
			console.log("FLICKR DATA", photoList);

			const photoResultUrl = "http://farm" + photoList.farm + ".static.flickr.com/" + photoList.server + "/"+photoList.id + "_"+photoList.secret + "_b.jpg";
			const thumbnailUrl = "http://farm" + photoList.farm + ".static.flickr.com/" + photoList.server + "/"+photoList.id + "_"+photoList.secret + "_n.jpg";
			const id = photoList.id

			const photoInfo = {
				"id": id,
				"url": photoResultUrl,
				"thumbnail": thumbnailUrl
			};

			results.push(photoInfo);
			
			callback(null);
		},

		function(err) {
			//console.log('hit da route');
			//console.log(results);

			res.json(results);
			
		});

	});

});

module.exports = router;
