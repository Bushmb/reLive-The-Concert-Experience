/* jshint esversion: 6 */

var express = require('express');
var router = express.Router();
var async = require('async');

var User = require('../models/user');

/* GET users listing. */
// router.get('/:name', function(req, res, next) {
///////// router.post('/', function(req, res, next)	{

router.get('/:name', function(req, res, next)	{

	console.log("USER" + req.user.spotify.token);

	const results = [];
	// const name = req.body.name;
	// // const name = req.params["name"];
	// 
	const lastfm_api = process.env.LASTFM_API_KEY;
	const name = req.params["name"];

	if(name == null) {
		name = req.body.name;
	}


	// const url = "http://api.setlist.fm/rest/0.1/search/artists.json?artistName=" + name;
	const url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + name + "&api_key=" + lastfm_api + "&format=json";
	const request = require("request");
	const async = require("async");
	request(url, function(error, response, body) {
		// console.log(body);
		data = JSON.parse(body);
		// const artistList = data.artists.artist;
		const artistList = data.results.artistmatches.artist; 
		// console.log(artistList);

		async.eachSeries(artistList, function(artistList, callback) {
			const artistName = artistList.name;
			//["name"];
			const artistMbid = artistList.mbid;
			//["mbid"];
			const image = artistList.image[2]["#text"];
	
			if(artistMbid) {
				const artistInfo = { 
					"artistMbid": artistMbid,  
					"artistName": artistName,
					"image":image 
				};
				results.push(artistInfo);
			}
			
			callback(null);
		},
		function(err) {
			//console.log('hit da route');
			//console.log(results);

			res.json(results);
			
		});

	});

});

router.get('/setlists/:mbid', function(req, res, next)  {
// exports.search_setlists = function(req, res) {

	const results = [];
	const songList = [];
	const mbid = req.params["mbid"];
	if(mbid === null) {
		mbid = req.body.mbid;
	}
	const url = "http://api.setlist.fm/rest/0.1/search/setlists.json?artistMbid=" + mbid;
	const request = require("request");
	const async = require("async");
	request(url, function(error, response, body) {
		
		if(!body.includes('not found')) {
			const data = JSON.parse(body);

			const setlist = data.setlists.setlist;

			async.eachSeries(setlist, function(setlist, callback) {
				const id = setlist["@id"];
				const eventDate = setlist["@eventDate"];
				const venueName = setlist.venue["@name"];
				const artistName = setlist.artist["@name"];
				const artistMbid = setlist.artist["@mbid"];
				const sets = setlist.sets.set;
				
				//console.log('---------------------')
				let songs

				//console.log(setlist);
				if(sets) {
					// if its an array
					if (Array.isArray(sets)) {
						//console.log("IN FIRST FUNCTION")
						songs = sets.reduce(function(arr, set){
							// map over all songs and return song name
							if(Array.isArray(set.song)) {
								const songArray = set.song.map(function(song) {
									return song["@name"];
								});
								arr = arr.concat(songArray);							
							}
							return arr;				
						}, []);
					}
					// else its an object
					else if (typeof sets == 'object') {
						//console.log("IN SECOND FUNCTION")
						// if sets.song is an array
						if(Array.isArray(sets.song)) {
							songs = sets.song.reduce(function(arr, song){
								arr.push(song["@name"]);
								return arr;
							}, []);
						}
						else {
							//console.log("IN THIRD FUNCTION")
							songs = sets.song["@name"];
							//console.log("SONGS!!!",songs)
						}
						// else we jsut the single song
						
					}

					else if (sets == "") {
						//console.log("REACHED UNDEFINED FUNCTION!!!")
						songs = "There wasn't any setlists found for this event";
					}

				}
				
				//console.log('---------------------')

				const setlistInfo = { 
					"id": id, 
					"eventDate":eventDate, 
					"venueName":venueName,  
					"artistName":artistName, 
					"artistMbid":artistMbid,
					"songs":songs
				};
				results.push(setlistInfo);
				callback(null);
			},
			function(err) {
				//console.log("SETLIST RESULTS:" + results);
				// console.log(songList);
				// console.log(err);
				//console.log("SETLISTS INCOMING")
				//console.log(results);

				// res.render('setlist_results', {
				//     pageTitle: 'Setlists',
				//     results: results
				// });

				res.json(results);
			});
		}
		else {
			res.send("not found")
		}
		
	});
});



// router.post("/playlist", function(req, res) {

// 	var SpotifyWebApi = require('spotify-web-api-node');

// 	const songs = req.body["tracks[]"][0];

// 	// var name = "pearl jam";
// 	// var song = "better man";
// 	// credentials are optional
// 	var spotifyApi = new SpotifyWebApi({
// 	  clientId : 'fc33a905e5eb4b48930beca47d2d0fa1',
// 	  clientSecret : '8e92510c66cf4a8e8fd23a67862d9c8e'
// 	});

// 	spotifyApi.searchTracks(songs)
// 	  .then(function(data) {
// 			// console.log('Search tracks by "Alright" in the track name and "Kendrick Lamar" in the artist name', data.body);
// 			// console.log(data.body.tracks.items);
// 			// console.log(data.body.tracks.items);
// 			console.log(data.body.tracks.items[0].preview_url);
// 			res.redirect(data.body.tracks.items[0].preview_url);
// 			// res.json(data.body.tracks.items[0].preview_url);
// 			// res.json(data.body.tracks.items);
// 			// res.(spotify:track:2B98ljvzqpCVgt5reTHq28);
// 			// data.body.tracks.items.id
// 		}, function(err) {
// 			// res.json(results);
// 			console.log('Something went wrong!', err);
// 	});

// });


// // 1st para in async.each() is the array of items
// async.eachSeries(songs,
//   // 2nd param is the function that each item is passed to
//   function(item, callback){
//     // Call an asynchronous function, often a save() to DB
//     spotifyApi.searchTracks(song)
//       .then(function(data) {
//     	console.log("DATA" + data.body.tracks.items);
//       	songIds.push(data.body.tracks.items[0].id);
//       	callback();
    		
//     	}, function(err) {
//     		// res.json(results);
//     		console.log('Something went wrong!', err);
//     });
// },
// // 3rd param is the function to call when everything's done
// function(err){
//   // All tasks are done now
//   console.log(songIds);
// }
// );




router.post("/playlist", function(req, res) {


	const SpotifyWebApi = require('spotify-web-api-node');

	const songs = req.body["tracks[]"];
	console.log("BODY", req.body)
	const {venue, date, artistName, save} = req.body;
	let songIds = [];
	let songPreviews = [];

	const playlistTitle = artistName + " - " + venue + " - " + date;
	console.log(playlistTitle);


	console.log("HIT PLAYLIST ROUTE")
	const spotifyApi = new SpotifyWebApi({
	  clientId : process.env.SPOTIFY_CLIENTID,
	  clientSecret: process.env.SPOTIFY_CLIENTSECRET
	});

	// 1st para in async.each() is the array of items
	// 2nd param is the function that each item is passed to
	async.eachSeries(songs, function(song, callback){
	  
	    // Call an asynchronous function, often a save() to DB
	    console.log("SONG CALLING SPOITFY API" + song);
	    spotifyApi.searchTracks(song)
	      .then(function(data) {
	      	// console.log(data.body.tracks.items[0]);
	    	if(data !== undefined) {
	    		console.log("SUCCESS!!!!!!!!!!!!!!!!!!!!!!")
	    		songIds.push("spotify:track:" + data.body.tracks.items[0].id);
	    		songPreviews.push(data.body.tracks.items[0].preview_url);
    		  	console.log("NAME return for song" + data.body.tracks.items[0].name);
    			console.log("ID return for song" + data.body.tracks.items[0].id);
	    	}
	      	
	    	callback();	
	    	}).catch(function(err) {
	    			console.log("FAIL!!!!!!!!!!!!!!!!!!!!! NOT FOUND");
	    			console.log(song);
	    		    // console.log("ERROR MESSAGE" + err.message);
	    		    // console.log('Something went wrong!');
	    	callback();
	    	});
	      	
	},
	// 3rd param is the function to call when everything's done
	function(err){
	  // All tasks are done now
		console.log("SPOTIFY FOUND --------")
		console.log(songIds.length);
		console.log(songIds);
		console.log(songPreviews);
		console.log("----------------------")

	
	
	//testing to see if user is logged in as user or with spotify authorization

		var testingUser = req.user;

		if(testingUser.local.email){
		    console.log("yes, i have that LOCAL property");
		    console.log("LOCAL USER DETAILS!!", req.user);
		}
		
		else if(testingUser.spotify.id){
			console.log("yes, i have that SPOTIFY property")
			console.log("SPOTIFY USER DETAILS!!", req.user);
		}

	//Call function to add tracks to create new playlist and add tracks

	makePlaylist(songIds, req.user, playlistTitle, save, spotifyApi);

	}
	);

			
		

});

	function makePlaylist(songIds, user, playlistTitle, save, spotifyApi) {

		// if false: create playlist
		if(save === "false") {
			console.log("hello from save")
			console.log("USEER", user)
			console.log("HAS LISTENINGPLAYLISTID", !user.spotify.listeningPlaylistId);

			const playlistTitle = "TEMPORARY PLAYLIST";
			// check if user has listeningPlaylistId
			User.findById(user.id, function(err, user){

				if(!user.spotify.listeningPlaylistId) {
				console.log("DOESNT HAVE ID YET, SO CREATE NEW ONES");
				
				createPlaylist(songIds, user, playlistTitle, spotifyApi);
				}

				else {
					console.log("ALREADY HAS A PLAYLIST>>>OVERWRITING");
					updatePlaylist(songIds, user, user.spotify.listeningPlaylistId, spotifyApi);
				}
				// else update setlistst on spotify

				

			})
		}
		else if(save === 'true') {

			createPlaylist(songIds, user, playlistTitle, spotifyApi);
		}
	}

	function createPlaylist(songIds, user, playlistTitle, spotifyApi) {

		let playlistId;

		// playlistTitle = "TEMPORARY PLAYLIST"; //+ playlistTitle;
		
		let {token, name} = user.spotify;

		spotifyApi.setAccessToken(token);

		console.log("FIRST PLAYLIST CREATED");
		spotifyApi.createPlaylist(name, playlistTitle)
			.then(function(data) {
			    console.log('Ok. Playlist id 123 created!');
			    playlistId = data.body.id; //['id'];

			    console.log("PLAYLIST INFO!!!!", data.body.tracks);
			    console.log("PLAYLIST ID" + playlistId);

			    // Add tracks to the playlist
			    return spotifyApi.addTracksToPlaylist(name, playlistId, songIds);

			}).then(function(data) {
				console.log("PLAYLIST CREATED DATA" + data);
				// save the id to mongo
				user.spotify.listeningPlaylistId = playlistId;
				user.markModified('spotify.listeningPlaylistId');
				user.save();

				console.log(user.spotify.listeningPlaylistId);

			    console.log('Ok. Tracks added!');

			}).catch(function(err) {
			    console.log(err.message);
			    console.log('Something went wrong!');
		  	});
	}

	function updatePlaylist(songIds, user, listeningPlaylistId, spotifyApi) {

		let {token, name} = user.spotify;

		spotifyApi.setAccessToken(token);

		console.log("UPDATING PLAYLIST WITH ----");
		console.log("Name:", name);
		console.log("token", token);
		console.log("ID TO UPDATE", listeningPlaylistId);
		console.log("SONGS", songIds);

		spotifyApi.replaceTracksInPlaylist(name, listeningPlaylistId, songIds)
			  .then(function(data) {
			    console.log('Ok. Tracks replaced!');
			  }).catch(function(err) {
			    console.log(err.message);
			    console.log('Something went wrong!');
			  });

	}



	// 	console.log("FIRST PLAYLIST CREATED");
	// 	spotifyApi.createPlaylist(name, playlistTitle)
	// 		.then(function(data) {
	// 		    console.log('Ok. Playlist id 123 created!');
	// 		    playlistId = data.body['id'];
	// 		    console.log("PLAYLIST ID" + playlistId);

	// 		    // Add tracks to the playlist
	// 		    return spotifyApi.addTracksToPlaylist(name, playlistId, songIds);

	// 		}).then(function(data) {
	// 			console.log("PLAYLIST CREATED DATA" + data);
	// 			// save the id to mongo

	// 		    console.log('Ok. Tracks added!');

	// 		}).catch(function(err) {
	// 		    console.log(err.message);
	// 		    console.log('Something went wrong!');
	// 	  	});

	// }
	// 	// if playlist was already created in mongo
	// 		// update playlist id with old playlist id
	// 	// else
	// 		// create playlist and save id to mongo


	// // if true: save playlist directly to Spotify



	// let playlistId;

	// playlistTitle = "TEMP-" + playlistTitle;
	
	// let {token, name} = user.spotify;

	// spotifyApi.setAccessToken(token);

	
		

	//   	// save the old playlist id in mongo

	//   	let oldPlaylistId = playlistId;
	// }

	// else {
	// 	console.log("UPDATING PLAYLIST");
	// 	spotifyApi.replaceTracksInPlaylist(name, oldPlaylistId, songIds)

	// 		  .then(function(data) {

	// 		    console.log('Ok. Tracks replaced!');
	// 		  }).catch(function(err) {
	// 		    console.log(err.message);
	// 		    console.log('Something went wrong!');
	// 		  });

	// }  	

	


module.exports = router;