/* jshint esversion: 6 */

var express = require('express');
var router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
	  clientId : process.env.SPOTIFY_CLIENTID,
	  clientSecret: process.env.SPOTIFY_CLIENTSECRET
	});



var User = require('../models/user');

/* GET users information. */
router.get('/:localUserId', function(req, res, next) {

	console.log("REQ!!!!", req.user);

	let user = req.user;

	let {id, token, listeningPlaylistId} = user.spotify;

	// //const localUserId = req.params["localUserId"];

	spotifyApi.setAccessToken(token);

	// // User.findById(localUserId, function(err, user){
	// // 	console.log("USER DATA", user);
	// // });

	spotifyApi.getPlaylist(id, listeningPlaylistId)
		.then(function(data) {
				console.log(typeof data.body.public);
				console.log('Ok. Old playlist was found ' + data.body.id + " and public is set" + data.body.public);
			if(data.body.public == false){
				console.log("PLAYLIST WAS FOUND, BUT IS SET TO PRIVATE>>>MUST CREATE NEW TEMP PLAYLIST");
				console.log("USER BEFORE PLAYLIST DELETE", user);
				user.spotify.listeningPlaylistId = undefined;
				user.save();
				console.log("USER AFTER PLAYLIST DELETE", user);
			}
			else if(data.body.public == true) {
				if(data.body.name === "TEMPORARY PLAYLIST") {
					console.log("PLAYLIST WAS FOUND, AND IS STILL NAMED TEMPORARY PLAYLIST");
					return;
				}
				else if(data.body.name !== "TEMPORARY PLAYLIST") {
					console.log("PLAYLIST WAS FOUND, BUT IS NOT NAMED TEMPORARY PLAYLIST");
					user.spotify.listeningPlaylistId = undefined;
					user.save();
				}
			}
			//console.log(data.body.public);		

		}).catch(function(err) {
			// user.spotify.listeningPlaylistId = "";
			// user.markModified('spotify.listeningPlaylistId');
			// user.save();

			console.log(err.message);
			console.log('User must not have a previous TEMP playlist');

			console.log("BEFORE LISTENING ID RESET", user);
			user.spotify.listeningPlaylistId = undefined;
			user.save();

			console.log("AFTER LISTENING ID RESET", user);

		});
	console.log("SAVED PLAYLISTS");	
	console.log(user.spotify.savedPlaylists);


	// spotifyApi.getUserPlaylists(id, { limit : 50 })
	// 	.then(function(data) {
	// 		console.log(data.body);
	// 	 	console.log('Ok. Got User ' + id);
	// 	}).catch(function(err) {
	// 	 	console.log(err.message);
	// 	 	console.log('Something went wrong!');
	// 	});

	// //console.log("USER ROUTE REQUEST", req.user);

	// //grab users playlist info from spotify
	// //checkUsersPlaylists(user, spotifyApi);

	// // res.send("GOT THE PLAYLIST DATA, MAYBE!")

	res.render('search.html', { user: req.user });



}); //end of router.get()

function checkUsersPlaylists(user, spotifyApi) {

	let {id} = user.spotify;

	spotifyApi.setAccessToken(token);

	console.log("GETTING USER PLAYLISTS");

	spotifyApi.getUserPlaylists(userId)
		.then(function(data) {
			console.log(data);
		 	console.log('Ok. Tracks replaced!');
		}).catch(function(err) {
		 	console.log(err.message);
		 	console.log('Something went wrong!');
		});

}

module.exports = router;
