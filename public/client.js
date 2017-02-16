/* jshint esversion: 6 */

function watchPlaySetlist() {

	$(".setlist").on('click', '.btn', function(){ 
	     
	     document.location = "http://localhost:8080/setlist/" + $(this).attr("data-artist") + "/" + $(this).attr("data-song")
	     // alert($(this).attr("data-song"));
	});

	$('#results').on('click', '.setListApi', function(){
		// collect the mbid 
		const artistName = $(this).attr("data-artistName");
		const photoUrl = "/photos/" + artistName;

		const mbid = $(this).attr("data-mbid");
		const url = "/search/setlists/" + mbid;


		$.get(photoUrl, function(data) {
			console.log("MADE THE PHOTO CALL");
			console.log("PHOTO DATA", data);

			let toAppend = '';
			for(i = 0; i < data.length; i++) {
				console.log(data[i].url);

			toAppend +=	"<li class='col-lg-3 col-md-3 col-sm-4'>" +
						    "<div class='speaker'>" +
						        "<figure class='effect-ming'>" + 
						            "<img class='img-responsive' src='" + data[i].thumbnail + "' alt=''/>" +
						              "<figcaption>" +
						                  "<span><a href='" + data[i].url + "' target='_blank'><img class='img-responsive' src=img/plus.png alt=''></a></span>" +
						              "</figcaption>" +      
						        "</figure>" + 
				            "</div>" + 
		          		"</li>";
				        //   <div class="caption text-center">
				        // <h4>Death in June</h4>
				        //       <p class="company">05-22-2016</p>
				        //   </div>   
				     

				// toAppend += `<div class="thumbnail"><a href="${data[i].url}" target="_blank"><img src=${data[i].url}></a></div>`;

				// "<div class='thumbnail'><a target='_blank' href='" + data[i].url "'><img src='" + data[i].url + "' alt='Photo " + id + "' style='width:100%'>" + "</a></div>";
			}
			$('#photo-results').html(toAppend);
		});

		
		$.get(url, function(data) {

			let toAppend = '';

			console.log("DATA", data);
			
			if(data.length > 0){
				
				for(i = 0; i < data.length; i++) {

					if(i == 0 || (i % 3) == 0){
						toAppend += "<div class='row'>";
					}
				
					toAppend += "<div class='" + data[i].id + " feature col-lg-4 col-md-4 col-sm-4'>" + 
								"<h3 class='artist-name'>" + data[i].artistName + "</h3>" + 
								"<h4 class='venue'>" + data[i].venueName + "</h4>" + 
								"<h4 class='date'>" + data[i].eventDate + "</h4>" + 
								"<h4>" + data[i].songs.length + " songs </h4>"; 

					if (data[i].songs.length > 1 && Array.isArray(data[i].songs	))	{		
						for(j = 0; j < data[i].songs.length; j++) {
							
							// toAppend += `<p class="song-name">${data[i].songs[j]}</p>`;
							toAppend += "<p class='song-name'>" + data[i].songs[j] + "</p>";
							
						}
					}
					else {
						// toAppend += `<p class="song-name">${data[i].songs[j]}</p>`;
						toAppend += "<p>" + data[i].songs + "</p>";
					}


					//NEED TO FIGURE OUT HOW TO ADD A ROW FOR EVERY 3 ITEMS!!!!!!!!
					

					toAppend += "<button class='play-setlist' data-playlist-id='" + data[i].id + "'> Play Setlist </button><br>";
					toAppend += "<button class='save-setlist' data-playlist-id='" + data[i].id + "'> SAVE Setlist </button></div>";
				

					if((i % 3) == 0 && i != 0){
						toAppend += "</div>";
					}
				}

				$('#artist-results').html(toAppend);

			}
			else if(!data || data.length === 0 || data === null){
				console.log("SHOULD BE THROWING ERROR");
				toAppend += "<h4>There were no setlists found for this artist</h4>";

				$('#artist-results').html(toAppend);
			}
			else {
				console.log("SHOULD BE THROWING ERROR");
				toAppend += "<h4>There were no setlists found for this artist</h4>";

				$('#artist-results').html(toAppend);
			}
			
			let title = "<h1>YOUR SEARCH RESULTS</h1>" + 
						"<p class='lead'>We found these recent concerts</p>";
			$('#search-result-title').html(title);
		});

	});		

	$('#search').on('keyup', function(e){
	   if(e.keyCode === 13) {
	   	console.log("working");
	     const parameters = $(this).val();
	     const url = "/search/" + parameters;
	       console.log(url);
	     
	    	$.get(url, function(data) {
	    		let toAppend = '';
	    		for(i = 0; i < data.length; i++) {
	    			const artistName = data[i].artistName;
	    			const artist = artistName.split(' ').join('+');
	    			console.log(artist);
	    			toAppend += "<div><input type='button' class='setListApi' value='" + data[i].artistName + "' data-mbid=" + data[i].artistMbid + " data-artistName=" + artist + "/></div>";
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



	$("#artist-results").on("click", ".play-setlist", function(event) {
		setlistSpotify(this, false);
	});

	$("#artist-results").on("click", ".save-setlist", function(event){
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


