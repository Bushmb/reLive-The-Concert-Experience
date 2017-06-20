/* jshint esversion: 6 */

var express = require('express');
var router = express.Router();
var async = require('async');

var User = require('../models/user');



/* GET aritsts listings from lastfm */

router.get('/:name', function(req, res, next)	{

	const results = [];	
	const lastfm_api = process.env.LASTFM_API_KEY;
	const name = req.params["name"];

	if(name == null) {
		name = req.body.name;
	}

	const url = "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" 
				+ name + "&api_key=" + lastfm_api + "&format=json";
	const request = require("request");
	const async = require("async");

	request(url, function(error, response, body) {

		const data = JSON.parse(body);
		const artistList = data.results.artistmatches.artist; 

		async.eachSeries(artistList, function(artistList, callback) {

			const artistName = artistList.name;
			const artistMbid = artistList.mbid;
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

			res.json(results);
			
		});

	});

});

// get setlists from setlist.fm

router.get('/setlists/:mbid', function(req, res, next)  {

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
				
				let songs;

				if(sets) {
					// if its an array
					if (Array.isArray(sets)) {
					
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
				
						// if sets.song is an array
						if(Array.isArray(sets.song)) {
							songs = sets.song.reduce(function(arr, song){
								arr.push(song["@name"]);
								return arr;
							}, []);
						}
						// else we just get the single song
						else {
							songs = sets.song["@name"];
						}
						
						
					}

					else if (sets == "") {
						songs = "There wasn't any setlists found for this event";
					}

				}

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
					callback(null);
				}	




			},
			function(err) {
				res.json(results);
			});

		}
		else {
			const data = null;
			res.send(data);
		}
		
	});
});

// build playlist from spotify
router.post("/playlist", function(req, res) {

	const SpotifyWebApi = require('spotify-web-api-node');
	const token = req.user.spotify.token;
	const songs = req.body["tracks[]"];
	const indivSongs = req.body["indivSongs[]"];
	const {venue, date, artistName, save} = req.body;
	const playlistDetails = {
		artistName: artistName,
		venue: venue,
		date: date,
		indivSongs: indivSongs,
	};
	let songIds = [];
	let songPreviews = [];
	let songDuration = 0;
	const playlistTitle = artistName + " - " + venue + " - " + date;

	const spotifyApi = new SpotifyWebApi({
	  clientId : process.env.SPOTIFY_CLIENTID,
	  clientSecret: process.env.SPOTIFY_CLIENTSECRET
	});

	spotifyApi.setAccessToken(token);
	
	async.eachSeries(songs, function(song, callback){
	 
	    spotifyApi.searchTracks(song)
	      .then(function(data) {

	    	if(data !== undefined) {
	    		songDuration += data.body.tracks.items[0]["duration_ms"];	    		
	    		songIds.push("spotify:track:" + data.body.tracks.items[0].id);
	    		songPreviews.push(data.body.tracks.items[0].preview_url);
	    	}
	      	
	    	callback();	

	    	}).catch(function(err) {
	    		console.log("ERROR MESSAGE" + err.message);
	    		callback();
	    	});
	      	
	},
	// function to call when everything's done
	function(err){
	// All tasks are done now
	// testing to see if user is logged in as user or with spotify authorization

		var testingUser = req.user;

		if(testingUser.local.email){
		    console.log("yes, i have that LOCAL property");
		    console.log("LOCAL USER DETAILS!!", req.user);
		}
		
		else if(testingUser.spotify.id){
			console.log("yes, i have that SPOTIFY property")
			console.log("SPOTIFY USER DETAILS!!", req.user);
		}

		var playlistLength = new Date(songDuration);
		var playlistMinutes = playlistLength.getMinutes();
		
		//Call function to add tracks to create new playlist and add tracks
		var makeArgs = [ songIds, songDuration, req.user, 
						 playlistDetails, playlistTitle, 
						 save, spotifyApi, res ];

		makePlaylist(...makeArgs);
		
	}

	);
	

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


function makePlaylist(songIds, songDuration, user, playlistDetails, playlistTitle, save, spotifyApi, res) {

	// if false: create playlist
	if(save === "false") {
		
		// check if user has listeningPlaylistId
		User.findById(user.id, function(err, user){

			if(!user.spotify.listeningPlaylistId) {
				const playlistTitle = "TEMPORARY PLAYLIST";
				createPlaylist(songIds, user, save, playlistDetails, playlistTitle, spotifyApi, res);
			}

			else {
				updatePlaylist(songIds, user, user.spotify.listeningPlaylistId, spotifyApi, res);
			}

		});
	}
	else if(save === "true") {
		createPlaylist(songIds, user, save, playlistDetails, playlistTitle, spotifyApi, res);
	}
}

function createPlaylist(songIds, user, save, playlistDetails, playlistTitle, spotifyApi, res) {

	let playlistId;
	let {token, name, savedPlaylists, id} = user.spotify;
	let {artistName, venue, date, indivSongs} = playlistDetails;	

	spotifyApi.setAccessToken(token);

	spotifyApi.createPlaylist(name, playlistTitle)
		.then(function(data) {
		    
		    playlistId = data.body.id;

		    // Add tracks to the playlist
		    return spotifyApi.addTracksToPlaylist(name, playlistId, songIds);

		}).then(function(data) {

			// save the id to mongoDB
			if(save === "false") {
				user.spotify.listeningPlaylistId = playlistId;
				user.markModified('spotify.listeningPlaylistId');
				user.save();
			}
			else if(save === "true") {
	
				let playlist = {
					playlistId: playlistId,
					artist: artistName,
					venue: venue,
					date: date,
					indivSongs: indivSongs,
				};
				
				user.spotify.savedPlaylists.push(playlist);
				user.markModified('spotify.savedPlaylists');
				user.save();
				
			}
		
		    res.json({	success: true, 
		    			spotifyUserId: id, 
		    			listeningPlaylistId: user.spotify.listeningPlaylistId, 
		    			playlistId: playlistId });

		}).catch(function(err) {
		    console.log(err.message);
	  	});
}

function updatePlaylist(songIds, user, listeningPlaylistId, spotifyApi, res) {

	let {token, name, id} = user.spotify;

	spotifyApi.setAccessToken(token);

	spotifyApi.replaceTracksInPlaylist(name, listeningPlaylistId, songIds)
		
		.then(function(data) {
			res.json({	success: true, 
						spotifyUserId: id, 
						listeningPlaylistId: listeningPlaylistId });
		})

		.catch(function(err) {
			// send response error to front end
			res.json({success: false, msg: 'Unable to save Playlist'});
			console.log(err.message);
		});

}

function checkUsersPlaylists(user, spotifyApi) {

	let {id} = user.spotify;

	spotifyApi.setAccessToken(token);

	spotifyApi.getUserPlaylists(userId)
		.then(function(data) {
		  return(data);
		}).catch(function(err) {
		  console.log(err.message);
		});

}
	

module.exports = router;

