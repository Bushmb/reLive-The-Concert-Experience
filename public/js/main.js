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
	 
	  
	// //COUNTDOWN TIMER
	// var newYear = new Date(); 
 //    newYear = new Date(newYear.getFullYear() + 1, 1 - 1, 1); 
 //    $('#countdown').countdown({until: new Date(2017, 3-1, 18)}); // enter event day 
    
 //    $('#removeCountdown').toggle(
 //        function() {
 //            $(this).text('Re-attach'); 
 //            $('#defaultCountdown').countdown('destroy'); 
 //        }, 
 //        function() { 
 //            $(this).text('Remove'); 
 //            $('#defaultCountdown').countdown({until: newYear}); 
 //        }
 //    );
	  
	
	// //MAGNIFIC POPUP LOAD CONTENT VIA AJAX
	// $('.html-popup').magnificPopup({type: 'ajax'});
 	
	// //MAGNIFIC POPUP IMAGE
	// $('.image-popup').magnificPopup({
	// 	type:'image',
	// 	gallery: {
	// 		enabled: true,
	// 		navigateByImgClick: true,
	// 		preload: [0,1] // Will preload 0 - before current, and 1 after the current image
	// 	},
		
	// });
    
 //    //LOAD MORE
 //    $('#list-speaker li:lt(4)').show();
    
 //    $('#loadmore').on("click", function () {
 //    	$('#list-speaker li:lt(8)').fadeIn();
 //    	$('#list-speaker li:lt(8)').show();		
 //    });
	
	
    
 //    //FAQ TOGGLE 
 //    $('.faqs dd').hide();
 //    $('.faqs dt').on({
 //        click : function(){ $(this).next().slideToggle('normal'); },
 //        mouseenter : function(){ $(this).addClass('hover'); },
 //        mouseleave : function(){ $(this).removeClass('hover'); }
 //    });
	  
	// //OWLCAROUSEL HOTEL CAROUSEL
	// var owl = $("#hotel-carousel");
 
	//   owl.owlCarousel({
	// 	  autoPlay: false,
	// 	  itemsCustom : [ [0, 1], [450, 1], [600, 3], [700, 3], [1000, 3], [1200, 3], [1600, 3] ],
	// 	  pagination : false,
	// 	  navigation : true,
	// 	  navigationText : ['<i class="pe-4x pe-7s-angle-left pe-border"></i>','<i class="pe-4x  pe-7s-angle-right pe-border"></i>'],
	//   });
	  
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
	  
	//   //OWLCAROUSEL PRICE TABLE CAROUSEL
	// var owl = $("#price-carousel");
 
	//   owl.owlCarousel({
	// 	  itemsCustom : [
	// 		[0, 1],
	// 		[450, 1],
	// 		[600, 2],
	// 		[700, 3],
	// 		[1000, 3],
	// 		[1200, 3],
	// 	  ],
	// 	  pagination : false,
	// 	  navigation : true,
	// 	  navigationText : ['<i class="pe-4x pe-7s-angle-left pe-border"></i>','<i class="pe-4x  pe-7s-angle-right pe-border"></i>'],
	//   });
	
	// //OWLCAROUSEL TESTIMONIAL CAROUSEL
	// var owl = $("#testimonial-carousel");
 
	//   owl.owlCarousel({
	// 	  navigation : false, // Show next and prev buttons
	// 	  slideSpeed : 300,
	// 	  paginationSpeed : 400,
	// 	  singleItem:true,
	// 	  transitionStyle : "fade"
	//   });
	
	// //OWLCAROUSEL SPONSORS CAROUSEL
	// var owl = $("#sponsors-carousel");
 
	//   owl.owlCarousel({
		  
	// 	  autoPlay: false,
	// 	  itemsCustom : [
	// 		[0, 1],
	// 		[450, 1],
	// 		[600, 3],
	// 		[700, 3],
	// 		[1000, 3],
	// 		[1200, 5],
	// 		[1600, 5]
	// 	  ],
	// 	  pagination : false,
	// 	  navigation : true,
	// 	  navigationText : ['<i class="pe-4x pe-7s-angle-left pe-border"></i>','<i class="pe-4x  pe-7s-angle-right pe-border"></i>'],
	//   });
	
	// INFO DATA
	 $('.number').counterUp({
		delay: 10,
		time: 3000
	});
	
	//FIX HOVER EFFECT ON IOS DEVICES
	document.addEventListener("touchstart", function(){}, true);
	
	
	
	
	// // CONTACT FORM
	// $("#ajax-contact-form").submit(function() {
	// 	var str = $(this).serialize();		
	// 	$.ajax({
	// 		type: "POST",
	// 		url: "contact_form/contact_process.php",
	// 		data: str,
	// 		success: function(msg) {
	// 			// Message Sent - Show the 'Thank You' message and hide the form
	// 			if(msg == 'OK') {
	// 				var result = '<div class="notification_ok">Your message has been sent. Thank you!</div>';
	// 				$("#fields").hide();
	// 			} else {
	// 				var result = msg;
	// 			}
	// 			$('#note').html(result);
	// 		}
	// 	});
	// 	return false;
	// });
	// $('#ajax-contact-form .shortcode_button').on('click', function() {  
	// 	setTimeout(block_height, 100);
	// });
	
	
	
	
	// //GOOGLE MAPS
		  
	// // Creating a LatLng object containing the coordinate for the center of the map
	// var latlng = new google.maps.LatLng(40.801485408197856, -73.96745953467104);
	  
	// // Creating an object literal containing the properties we want to pass to the map  
	// var options = {  
	// 	zoom: 14, // This number can be set to define the initial zoom level of the map
	// 	center: latlng,
	// 	scrollwheel: false,
	// 	styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
	// 	mapTypeId: google.maps.MapTypeId.ROADMAP, // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
	// 	disableDefaultUI: true
	// };  
	// // Calling the constructor, thereby initializing the map  
	// var map = new google.maps.Map(document.getElementByClass('map-canvas'), options);  
	
	// // Define Marker properties
	// var image = new google.maps.MarkerImage('img/map-logo.png',
	// 	// This marker is 129 pixels wide by 42 pixels tall.
	// 	new google.maps.Size(125, 75),
	// 	// The origin for this image is 0,0.
	// 	new google.maps.Point(0,0),
	// 	// The anchor for this image is the base of the flagpole at 18,42.
	// 	new google.maps.Point(18, 42)
	// );
	
	// // Add Marker
	// var marker1 = new google.maps.Marker({
	// 	position: new google.maps.LatLng(40.801485408197856, -73.96745953467104), 
	// 	map: map,		
	// 	icon: image // This path is the custom pin to be shown. Remove this line and the proceeding comma to use default pin
	// });	
	
	// // Add listener for a click on the pin
	// google.maps.event.addListener(marker1, 'click', function() {  
	// 	infowindow1.open(map, marker1);  
	// });
		
		
	// // Create information window
	// function createInfo(title, content) {
	// 	return '<div class="infowindow"><h4>'+ title +'</h4>'+content+'</div>';
	// } 

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

// // REGISTER FORM FUNCTION
// var contact_send = function(){
	
// 	'use strict';
	
// 	var name  = $("#name").val();
// 	var email = $("#email").val();
// 	var phone = $("#phone").val();
// 	var type  = $("#type").val();
	
// 		 if ( name=="" ){ alert("name area is empty!"); $("#name").focus(); }
// 	else if ( email=="" ){ alert("email address area is empty!"); $("#email").focus(); }
// 	else if ( phone=="" ){ alert("phone number area is empty!"); $("#phone").focus(); }
// 	else if ( type=="" ){ alert("register type isn't selected!"); $("#type").focus(); }
// 	else {
// 		$.post("contact.send.php", { name:name, email:email, phone:phone, type:type }, function( result ){
// 			if ( result=="SUCCESS" ){
// 				alert("Your contact form is sent.");
// 				setTimeout(function(){
// 					$("#name").val("");
// 					$("#email").val("");
// 					$("#phone").val("");
// 					$("#type").val("");
// 				}, 3000);
// 			} else {
// 				alert("Your contact form isn't sent. Please check fields and try again.");
// 			}
// 		});
// 	}

// };

	/* NEWSLETTER FORM FUNCTION */
	var newsletter_send = function(){
	
		'use strict';
		
		var email 	= $("#newsletter_email").val();
		if ( email=="" ){ alert("Your email address is empty!"); $("#newsletter_email").focus(); }
		else {
			$.post("newsletter.send.php", { email:email }, function( result ){
				
				console.log( result );
				
				if ( result=="SUCCESS" ){
					alert("Thank you. Your email is added to our database.");
					setTimeout(function(){ $("#newsletter_email").val(""); }, 3000);
				}
				
				else if ( result=="EXIST" ){
					alert("Error. Your email address is already exist our database.");
					$("#newsletter_email").focus();
				}
				
				else {
					alert("Error. Your email isn't added to our database.");
					$("#newsletter_email").focus();
				}
				
			});
		}
	
	};

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
							                  "<span><a href='" + data[i].url + "' target='_blank'><img class='img-responsive' src=img/plus.png alt=''></a></span>" +
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
						  "<h3 class='venue'>" + data[i].venueName + "</h3>" +
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
			setlistSpotify(this, false);
		});

		$(".setlist-results").on("click", ".save-setlist", function(event){
			setlistSpotify(this, true);
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
	 	success: function(data) {
	 	      let toAppend = "<p>HIT THE ARROW BELOW TO START PLAYING</p>";
	 	      toAppend += "<iframe src='https://embed.spotify.com/?uri=spotify%3Auser%3A" + data.spotifyUserId + "%3Aplaylist%3A" + data.listeningPlaylistId + "' width='320' height='400' frameborder='0' allowtransparency='true'></iframe>";
	 	      console.log("DATA FROM SPOTIFY AJAX", data);
	 	      console.log("BACK FROM SPOTIFY AJAX");
	 	      $("#player").html(toAppend);
	 	}
	});

}