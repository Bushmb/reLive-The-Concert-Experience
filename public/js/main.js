jQuery(document).ready(function($) {
   
   'use strict';
   
   //REV SLIDER
   watchPlaySetlist();

   jQuery('.tp-banner').show().revolution(
	{
		dottedOverlay:"none",
		delay:5000,
		startwidth:1170,
		startheight:700,
		hideThumbs:200,
		
		thumbWidth:100,
		thumbHeight:50,
		thumbAmount:5,
		
		navigationType:"none",
		navigationArrows:"solo",
		navigationStyle:"preview1",
		
		touchenabled:"on",
		onHoverStop:"on",
		
		swipe_velocity: 0.7,
		swipe_min_touches: 1,
		swipe_max_touches: 1,
		drag_block_vertical: false,
								
								
		keyboardNavigation:"on",
		
		navigationHAlign:"center",
		navigationVAlign:"bottom",
		navigationHOffset:0,
		navigationVOffset:20,

		soloArrowLeftHalign:"left",
		soloArrowLeftValign:"center",
		soloArrowLeftHOffset:20,
		soloArrowLeftVOffset:0,

		soloArrowRightHalign:"right",
		soloArrowRightValign:"center",
		soloArrowRightHOffset:20,
		soloArrowRightVOffset:0,
				
		shadow:0,
		fullWidth:"off",
		fullScreen:"on",

		spinner:"spinner0",
		
		stopLoop:"off",
		stopAfterLoops:-1,
		stopAtSlide:-1,

		shuffle:"off",
		
								
		forceFullWidth:"off",						
		fullScreenAlignForce:"off",						
		minFullScreenHeight:"400",						
								
		hideThumbsOnMobile:"off",
		hideNavDelayOnMobile:1500,						
		hideBulletsOnMobile:"off",
		hideArrowsOnMobile:"off",
		hideThumbsUnderResolution:0,
		
		hideSliderAtLimit:0,
		hideCaptionAtLimit:0,
		hideAllCaptionAtLilmit:0,
		startWithSlide:0,
		fullScreenOffsetContainer: ".header"	
	});
   

  
    //SMOOTH SCROLL EFFECT
    $('[data-toggle="elementscroll"]').on("click", function(){
    	
    	'use strict';
    	
    	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    		var target = $(this.hash);
    		target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    		if (target.length) {
    			$('html,body').animate({ scrollTop: target.offset().top }, 1000);
    			return false;
    		}
    	}
    	
    });  
	  
	//OWLCAROUSEL FUNFACT CAROUSEL
	var owl = $("#infodata-carousel");
 
	  owl.owlCarousel({
		  itemsCustom : [
			[0, 1],
			[450, 1],
			[600, 2],
			[700, 4],
			[1000, 4],
			[1200, 4],
			[1600, 4]
		  ],
		  navigation : false,
		  navigationText : ['<i class="pe-4x pe-7s-angle-left pe-border"></i>','<i class="pe-4x  pe-7s-angle-right pe-border"></i>'],
	  });
	  
	// INFO DATA
	 $('.number').counterUp({
		delay: 10,
		time: 3000
	});
	
	//FIX HOVER EFFECT ON IOS DEVICES
	document.addEventListener("touchstart", function(){}, true);
	
});

$(window).load(function(){
		
    
	$("#nav-primary").sticky({ topSpacing: 0, });
	
    //PRELOADER
    $('#preload').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
	
	//CUSTOM TOOLBAR
	 $("#content").mCustomScrollbar({
        theme: "dark-3",
		live: "on",
      });

});


	function watchPlaySetlist() {

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
							                  "<span><a href='" + data[i].url + "' target='_blank' data-lightbox='photos'><img class='img-responsive' src=img/plus.png alt=''></a></span>" +
							              "</figcaption>" +      
							        "</figure>" + 
					            "</div>" + 
			          		"</li>";

				}
				$('#photo-results').html(toAppend);
			});

			
			$.get(url, function(data) {

				let toAppend = '';

				console.log("DATA", data);
				
				if(data.length > 0){
					
					for(i = 0; i < data.length; i++) {

						
						toAppend += "<div class='indiv-setlist " + data[i].id + "'>" + 
						  "<h3 class='artist-name'>" + data[i].artistName + "</h3>" + 
						  "<h4 class='venue'>" + data[i].venueName + "</h4>" +
						  "<h4 class='date'>" + data[i].eventDate + "</h4>" +
						  "<h5>" + data[i].songs.length + " songs </h4>" + 
						  "<div class='zebra'>";

						if (data[i].songs.length > 1 && Array.isArray(data[i].songs	))	{		
							for(j = 0; j < data[i].songs.length; j++) {
								

								toAppend += "<span class='song-name'>" + data[i].songs[j] + "</span>";
								
							}
						}
						else {
							
							toAppend += "<span class='song-name'>" + data[i].songs + "</span>";
						}
						

						toAppend += "<br><button class='btn play-setlist' data-playlist-id='" + data[i].id + "'> Play Setlist </button><br>";
						toAppend += "<button class='btn save-setlist' data-playlist-id='" + data[i].id + "'> SAVE Setlist </button></div></div>";
					
					}

					$('.setlist-results').html(toAppend);

				}
				else if(!data || data.length === 0 || data === null){
					console.log("SHOULD BE THROWING ERROR");
					toAppend += "<h4>There were no setlists found for this artist</h4>";

					$('.setlist-results').html(toAppend);
				}
				else {
					console.log("SHOULD BE THROWING ERROR");
					toAppend += "<h4>There were no setlists found for this artist</h4>";

					$('.setlist-results').html(toAppend);
				}
				
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

		    		toAppend += "<p>Choose from one of the artists below who match your search</p>"

		    		for(i = 0; i < data.length; i++) {
		    			const artistName = data[i].artistName;
		    			const artist = artistName.split(' ').join('+');
		    			console.log(artist);

		    			toAppend += "<input type='button' class='btn setListApi' value='" + data[i].artistName + "' data-mbid=" + data[i].artistMbid + " data-artistName=" + artist + "/>";
		    			
		    		}
		    		$('#results').html(toAppend);
		    	});

		    $(this).val('');
		    return false;

		    }
		 });

		$(".setlist-results").on("click", ".play-setlist", function(event) {
			$('#player').html('<img src="img/ajax-loading.gif"> loading...');
			setlistSpotify(this, false);
		});

		$(".setlist-results").on("click", ".save-setlist", function(event){
			$('#player').html('<img src="img/ajax-loading.gif"> loading...');
			setlistSpotify(this, true);
		});


		$('.panel-group').on('click', '.delete-btn', function(){
		   $(this).closest('.setlist-panel').remove();


		   let playlistToRemove = $(this).closest('.setlist-panel').attr("data-playlist-id");

		   // playlistToRemove = playlistToRemove.substring(1, 8);

		   console.log("PLAYLIST TO REMOVE", playlistToRemove);

		   $.ajax({
		       type: "DELETE",
		       url: "/search/playlist",
		       data: {
			   	  	playlistToRemove
		    	},
		    	success: function(data) {
		    	      console.log("removed from db", data);
		    	},
		    	fail: function(err) {
		    		console.log(err);
		    		//add dom notification to show error
		    	}
		    	
		   });
		   


		});
	}

		

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

	const indivSongs = tracks.map(function(track) {
		// build up string
		return track;
	});
	console.log(indivSongs);
	// use thst data to dynamicaly select a class
	const venue = $('.' + playlistId + ' .venue').text()
	const date = $('.' + playlistId + ' .date').text()
	

	const spotifyUserId = $("#setlist-player").attr("data-spotify-id");
	
	$.ajax({
	    type: "POST",
	    url: "/search/playlist",
	    data: {
		  	playlistId: playlistId,
		  	venue: venue,
		  	date: date,
		  	artistName: artistName,
		  	tracks: toApi,
		  	indivSongs: indivSongs,
		  	save: save
	 	},
	 	// beforeSend : function() {
	  //       loading.open();
	  //   },
	 	success: function(data) {
	 	      let toAppend = "<p>HIT THE ARROW BELOW TO START PLAYING</p>";
	 	      toAppend += "<iframe src='https://embed.spotify.com/?uri=spotify%3Auser%3A" + data.spotifyUserId + "%3Aplaylist%3A" + data.listeningPlaylistId + "' width='320' height='400' frameborder='0' allowtransparency='true'></iframe>";
	 	      $("#player").html(toAppend);
	 	      console.log("DATA BACK FROM SAVE CALL", data)
	 	      const spotifyId = data.spotifyUserId;
	 	      const playlistId = data.playlistId;
	 	      if(save == true) {
	 	      	 addSavedListToDOM(playlistId, venue, date, artistName, indivSongs, spotifyId);
	 	      }
	 	},
	 
	});

}

function addSavedListToDOM(playlistId, venue, date, artistName, indivSongs, spotifyId) {

	let toAppend = '';
	let songHTML = '';
	indivSongs.forEach(function(song) {
		songHTML += `<span class='song-name'>${song}</span>`;
	});

	console.log("ADDED TO DOM WITH PLAYLISTID", playlistId);

	toAppend += `<div class='panel panel-default setlist-panel' data-playlist-id='${playlistId}'><div class='panel-heading' role='tab' id='heading${playlistId}'><div class='row'>
                    <div class='col-lg-2 col-md-2 col-sm-2'><p class='date'>${date}</p></div><div class='col-lg-8 col-md-8 col-sm-8'><h4 class='panel-title'>
                    <a data-toggle='collapse' data-parent='#accordion' href='#Program${playlistId}' aria-expanded='true' aria-controls='Program${playlistId}'>${artistName} - ${venue}</a>
                    </h4></div><div class='col-lg-2 col-md-2 col-sm-2'><button class='btn delete-btn'>DELETE</button></div></div></div>
                    <div id='Program${playlistId}' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading${playlistId}'><div class='panel-body'><div class='row'>
                    <div class='col-lg-4 col-md-4 col-sm-4'><iframe src='https://embed.spotify.com/?uri=spotify%3Auser%3A${spotifyId}%3Aplaylist%3A${playlistId}' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>
                    </div><div class='col-lg-7 col-md-7 col-sm-10'><p class='speaker-name uppercase'>${artistName}</p><h4>${venue} + ${date}</h4> <div class='zebra'>${songHTML}</div>
                    <p><i class='fa fa-lg fa-clock-o'></i> <span class='small'>${indivSongs.length} Songs</span></p> <p><i class='fa fa-lg fa-map-marker'></i> <span class='small'>${venue}</span></p>                                   
                    </div></div></div></div></div></div>`;  
    $('#accordion1').append(toAppend);                                                  
               
}
