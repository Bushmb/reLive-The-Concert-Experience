function watchPlaySetlist() {

	$(".setlist").on('click', '.btn', function(){ 
	     
	     document.location = "http://localhost:8080/setlist/" + $(this).attr("data-artist") + "/" + $(this).attr("data-song")
	     // alert($(this).attr("data-song"));
	});

	$('#results').on('click', '.setListApi', function(){
		// collect the mbid 
		const mbid = $(this).attr("data-mbid");

		const url = "/search/setlists/" + mbid;
		console.log(url);

		$.get(url, function(data) {
			console.log("SETLIST RESULTS ON FRONT" + data[0].id);
			let toAppend = '';
			for(i = 0; i < data.length; i++) {
				console.log(data[i].artistName);
				console.log(data[i].songs)
				toAppend += "<div class='" + data[i].id + "'><h3 class='artist-name'>" + data[i].artistName + "</h3>" + 
							"<h4 class='venue'>" + data[i].venueName + "</h4>" + 
							"<h4 class='date'>" + data[i].eventDate + "</h4>" + 
							"<h4>" + data[i].songs.length + " songs </h4>"; 

				if (data[i].songs.length > 1 && Array.isArray(data[i].songs	))	{		
					for(j = 0; j < data[i].songs.length; j++) {
						toAppend += "<div class='song-name'>" + data[i].songs[j] + "</div>";
						// toAppend += "<li>" + data[i].artistName + "</li>"
					}
				}
				else {
					toAppend += "<div>" + data[i].songs + "</div>";
				}
				toAppend += "<button class='play-setlist' data-playlist-id='" + data[i].id + "'> Play Setlist </button></div>";
				toAppend += "<button class='save-setlist' data-playlist-id='" + data[i].id + "'> SAVE Setlist </button></div>";
			}

			$('#results').html(toAppend);
		});
	})		

	$('#search').on('keyup', function(e){
	   if(e.keyCode === 13) {
	   	console.log("working");
	     const parameters = $(this).val();
	     const url = "/search/" + parameters;
	       console.log(url);
	     
	    	$.get(url, function(data) {
	    		let toAppend = '';
	    		for(i = 0; i < data.length; i++) {
	    			console.log(data[i].artistName)
	    			toAppend += "<div><input type='button' class='setListApi' value='" + data[i].artistName + "' data-mbid=" + data[i].artistMbid + "/></div>"
	    		}
	    		$('#results').html(toAppend);
	    	});

	    $(this).val('');
	    return false;


	       		// .fail(function(data) {
	       		// 	console.log(data.responseText);
	       		// 	alert(data.responseText);
	       		// // alert(data);
	       		// });
	    }
	 });

}


	$("#results").on("click", ".play-setlist", function(event) {
		setlistSpotify(this, false);
	});

	$("#results").on("click", ".save-setlist", function(event){
		setlistSpotify(this, true);
	});


	function setlistSpotify(clickHandler, save) {
		const playlistId = $(clickHandler).data("playlist-id")// extracting data from the button
		const tracks = Array.from($('.' + playlistId + ' .song-name')).map(function(track) {
			return track.innerHTML;
		})
		const artistName = $('.' + playlistId + ' .artist-name').text()
		
		const toApi = tracks.map(function(track) {
			// build up string
			return 'track:' +track+ ' artist:' +artistName
		})
		// use thst data to dynamicallyy select a class
		const venue = $('.' + playlistId + ' .venue').text()
		const date = $('.' + playlistId + ' .date').text()
		

		$.post({
		  url: "/search/playlist",
		  data: {
		  	playlistId: playlistId,
		  	venue: venue,
		  	date: date,
		  	artistName: artistName,
		  	tracks: toApi,
		  	save: save
		  }
		})
		  .done(function( msg ) {
		    alert( "Data Saved: " + msg );
		  });
	}

// function populateResults(eventCity, eventDate){
	
// 	var toAppend = ''
// 	for(i=0; i < eventCity.length; i++){
// 		toAppend += "<div class='result' data-id="+ i +"><a href='#' class='fillthediv'>" +
// 					"<div class='numResult'>"+(i+1)+"</div>" +
// 					"<div class='fulldivhead'>" + eventCity[i] + "</div>" +
// 					"<div class='fulldivp'>" + eventDate[i] + "</div>" +
// 					"</a></div>"

// 	}
// 	$('#results-bar').append(toAppend);
// 	$('#showChoice').append(" " + eventCity.length + " shows played");
// }



$(document).ready(function() {

	watchPlaySetlist();

});


// function populateResults(data){
	
// 	console.log(data);
// 	var toAppend = ''
// 	for(i=0; i < data.length; i++){
// 		toAppend += "<li><img src=" + data[i].image + "><input type='button' class='setListApi' value=" + data[i].artistName +" data-mbid=" + data[i].artistMbid + "/></li>"
// 	}
// 	$('#results').append(toAppend);
// }


