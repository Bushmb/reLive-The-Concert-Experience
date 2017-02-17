var callbackURL = process.env.NODE_ENV === 'production' 
				? 'https://relive-concerts.herokuapp.com/callback'
				: 'http://localhost:8080/callback'

module.exports = {
  spotifyAuth: {
    clientID: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENTSECRET,
    callbackURL: callbackURL
  }
};