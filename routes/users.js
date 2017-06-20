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

	let user = req.user;
	let {id, token, listeningPlaylistId} = user.spotify;

	spotifyApi.setAccessToken(token);

	spotifyApi.getPlaylist(id, listeningPlaylistId)
		.then(function(data) {

			if(data.body.public == false){
				user.spotify.listeningPlaylistId = undefined;
				user.save();
			}
			else if(data.body.public == true) {
				if(data.body.name === "TEMPORARY PLAYLIST") {
					return;
				}
				else if(data.body.name !== "TEMPORARY PLAYLIST") {
					user.spotify.listeningPlaylistId = undefined;
					user.save();
				}
			}	

		}).catch(function(err) {
		
			console.log(err.message);
			user.spotify.listeningPlaylistId = undefined;
			user.save();
		});

	res.render('search.html', { user: req.user });

}); //end of router.get()


function checkUsersPlaylists(user, spotifyApi) {

	let {id} = user.spotify;

	spotifyApi.setAccessToken(token);

	spotifyApi.getUserPlaylists(userId)
		.then(function(data) {
		}).catch(function(err) {
		 	console.log(err.message);
		});

}

module.exports = router;
