var url = process.env.NODE_ENV === 'production' 
				? 'mongodb://developer:' + process.env.DBPASS + '@ds153659.mlab.com:53659/relive-concerts'
				: 'mongodb://localhost/userdatabase_v2'

module.exports = { url };
