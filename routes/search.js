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

	//console.log("REQUEST", req);

	const results = [];
	const songList = [];
	const mbid = req.params["mbid"];

	console.log("MBID!!", mbid);

	if(mbid === null) {
		mbid = req.body.mbid;
	}

	const url = "http://api.setlist.fm/rest/0.1/search/setlists.json?artistMbid=" + mbid;
	console.log("URLLLL", url);

	const request = require("request");
	const async = require("async");
	request(url, function(error, response, body) {

		console.log("SETLIST BODY!!!!!!!!!", body);
		
		if(!body.includes('not found')) {
			const data = JSON.parse(body);

			console.log("IN FIRST SETLIST FUNCTION!!");
			//console.log("DATA", data);

			const setlist = data.setlists.setlist;

			//console.log("SETLIST STUFFS", setlist);

			async.eachSeries(setlist, function(setlist, callback) {
				const id = setlist["@id"];
				const eventDate = setlist["@eventDate"];
				const venueName = setlist.venue["@name"];
				const artistName = setlist.artist["@name"];
				const artistMbid = setlist.artist["@mbid"];
				const sets = setlist.sets.set;
				
				//console.log('---------------------')
				let songs


// NEEEED TO FIX THIS FOR RETURNS WITH EMPTY SETS OR "@WITH", LIKE METALLICA

	//IF Sets = ""
	//IF Sets: { Set: { Song: { @name } } }

	

				//console.log(setlist);
				if(sets) {
					// if its an array
					if (Array.isArray(sets)) {
						console.log("IN FIRST INNER FUNCTION")
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
						console.log("IN SECOND INNER FUNCTION")
						// if sets.song is an array
						if(Array.isArray(sets.song)) {
							songs = sets.song.reduce(function(arr, song){
								arr.push(song["@name"]);
								return arr;
							}, []);
						}
						else {
							console.log("IN THIRD INNER FUNCTION")
							songs = sets.song["@name"];
							//console.log("SONGS!!!",songs)
						}
						// else we jsut the single song
						
					}

					else if (sets == "") {
						console.log("REACHED UNDEFINED FUNCTION!!!")
						songs = "There wasn't any setlists found for this event";
					}

				}
				
				//console.log("SONGS TO BE ADDED TO RESULST", songs);

				if(songs != undefined && songs != "" && songs != null) {

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

				}

				else {
					console.log("SONGS WAS EMPTY...NOT ADDING TO RESULTS");
					callback(null);
				}	




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
				//getFlickrPhotos("311");

				res.json(results);
			});
		}
		else {
			const data = null;
			res.send(data);
		}
		
	});
});








router.post("/playlist", function(req, res) {


	const SpotifyWebApi = require('spotify-web-api-node');

	const songs = req.body["tracks[]"];
	const indivSongs = req.body["indivSongs[]"];


	console.log("INDIV SONGS!!!!!", indivSongs);
	const {venue, date, artistName, save} = req.body;
	const playlistDetails = {
		artistName: artistName,
		venue: venue,
		date: date,
		indivSongs: indivSongs,
	};
	console.log("PLAYLISTDETAILS!!!!", songs);
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
		var makeArgs = [ songIds, req.user, 
						 playlistDetails, playlistTitle, 
						 save, spotifyApi, res ];

		makePlaylist(...makeArgs);
		
		// makePlaylist(songIds, req.user, playlistDetails, playlistTitle, save, spotifyApi, res);
	}

	);
	
	const listeningPlaylistId = req.user.spotify.listeningPlaylistId;
	const spotifyUserId = req.user.spotify.id;

});

router.delete('/playlist', function(req, res) {

	var playlistToRemove = req.body.playlistToRemove;

	User.findById(req.user.id, function(err, user){

		if(!err) {
			var filteredArr = user.spotify.savedPlaylists.filter(function(playlist) {
				return playlist.playlistId !== playlistToRemove;
			});

			if(filteredArr.length == user.spotify.savedPlaylists.length) {
				res.status(500).send('Something broke!');
			}
			else {
				user.spotify.savedPlaylists = filteredArr;
				user.save();
				res.send("SUCCESS, PLAYLIST DELETED");
			}
		
		}
		else {
			res.status(500).send('Something broke!');
		}
		

	});



});





///////// NEED TO ADD PLAYLISTS TO DATABASE AS USER SAVES, AND THEN CHECK ANY NEW PLAYLIST
///////// REQUESTS AGAINST DATABASE, to ensure only one TEMPORARY PLAYLIST PER SESSION
///////// CURRENTLY IT OVERWRITES A "SAVED" LIST IF YOU CHOOSE PLAY AS YOUR NEXT CHOICE.
	//if playlist is found, delete listeningPlaylistId entry and reset TEMP PLAYLIST PROCESS
	//




function makePlaylist(songIds, user, playlistDetails, playlistTitle, save, spotifyApi, res) {

	// if false: create playlist
	if(save === "false") {
		console.log("hello from save")
		console.log("USEER", user)
		console.log("HAS LISTENINGPLAYLIST ID:", user.spotify.listeningPlaylistId);

		
		// check if user has listeningPlaylistId
		User.findById(user.id, function(err, user){

			if(!user.spotify.listeningPlaylistId) {
				console.log("DOESNT HAVE ID YET, SO CREATE NEW ONES");
				const playlistTitle = "TEMPORARY PLAYLIST";
				createPlaylist(songIds, user, save, playlistDetails, playlistTitle, spotifyApi, res);
			}

			else {

				console.log("ALREADY HAS A PLAYLIST>>>OVERWRITING");
				updatePlaylist(songIds, user, user.spotify.listeningPlaylistId, spotifyApi, res);
				// console.log("LISTENING PLAYLIST ID!!!!!", listeningPlaylistId);
				// return listeningPlaylistId;
			}
			// else update setlistst on spotify

		});
	}
	else if(save === "true") {

		createPlaylist(songIds, user, save, playlistDetails, playlistTitle, spotifyApi, res);
	}
}

function createPlaylist(songIds, user, save, playlistDetails, playlistTitle, spotifyApi, res) {

	let playlistId;

	// playlistTitle = "TEMPORARY PLAYLIST"; //+ playlistTitle;
	
	let {token, name, savedPlaylists, id} = user.spotify;
	let {artistName, venue, date, indivSongs} = playlistDetails;	

	console.log(save);

	spotifyApi.setAccessToken(token);

	console.log("FIRST PLAYLIST CREATED");
	spotifyApi.createPlaylist(name, playlistTitle)
		.then(function(data) {
		    console.log('Ok. Playlist id: ' + data.body.id +  '  was created!');

		    playlistId = data.body.id; //['id'];

		    console.log("PLAYLIST INFO!!!!", data.body.tracks.items);
		    console.log("PLAYLIST ID" + playlistId);

		    // Add tracks to the playlist
		    return spotifyApi.addTracksToPlaylist(name, playlistId, songIds);

		}).then(function(data) {
			console.log("PLAYLIST CREATED DATA" + data);
			// save the id to mongo
			if(save === "false") {
				console.log("USER WANTS TO LISTEN NOT SAVE THIS LIST");
				user.spotify.listeningPlaylistId = playlistId;
				user.markModified('spotify.listeningPlaylistId');
				user.save();

			}
			else if(save === "true") {
				console.log("USER WANTS TO SAVE THIS LIST", user.spotify.savedPlaylists);

				// embedCode = '<iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3A' + id + '%3Aplaylist%3A' + playlistId + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
				// '<iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3Ajustannoyed%3Aplaylist%3A67vZ4AnRNsociAbVYDcU4f" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'
				let playlist = {
					playlistId: playlistId,
					artist: artistName,
					venue: venue,
					date: date,
					indivSongs: indivSongs,
					// embedCode: embedCode,
				};
				console.log("PLAYLIST INFO TO SAVE", playlist)
				user.spotify.savedPlaylists.push(playlist);
				user.markModified('spotify.savedPlaylists');
				user.save();
				console.log("AFTER PLAYLIST SAVED", user);
				// user.spotify.listeningPlaylistId == undefined;
				// user.markModified('spotify.listeningPlaylistId');
				// user.save();
				//return;	
			}
			console.log(user.spotify.listeningPlaylistId);

		    console.log('Ok. Tracks added!');

		    res.json({success: true, spotifyUserId: id, listeningPlaylistId: user.spotify.listeningPlaylistId, playlistId: playlistId});

		}).catch(function(err) {
		    console.log(err.message);
		    console.log('Something went wrong!');
	  	});
}


///////////NEED TO ADD EJS TO MAIN PAGE TO FILL IN DATA ABOUT PLAYLISTS, AND THEN APPEND NEW PLAYLISTS
///////////AS THEY ARE SAVED.

function updatePlaylist(songIds, user, listeningPlaylistId, spotifyApi, res) {

	let {token, name, id} = user.spotify;

	spotifyApi.setAccessToken(token);

	console.log("UPDATING PLAYLIST WITH ----");
	console.log("Name:", name);
	console.log("token", token);
	console.log("ID TO UPDATE", listeningPlaylistId);
	console.log("SONGS", songIds);

	spotifyApi.replaceTracksInPlaylist(name, listeningPlaylistId, songIds)
		
		.then(function(data) {
			res.json({success: true, spotifyUserId: id, listeningPlaylistId: listeningPlaylistId});
			console.log('Ok. Tracks replaced!');
		})

		.catch(function(err) {
			// send response error to front end
			console.log(err.message);
			console.log('Something went wrong!');
		});

}

function checkUsersPlaylists(user, spotifyApi) {

	let {id} = user.spotify;

	spotifyApi.setAccessToken(token);

	console.log("GETTING USER PLAYLISTS");

	spotifyApi.getUserPlaylists(userId)
		.then(function(data) {
		  return(data);
		  console.log('Ok. Users current playlists');
		}).catch(function(err) {
		  console.log(err.message);
		  console.log('Something went wrong!');
		});

}
	

module.exports = router;

