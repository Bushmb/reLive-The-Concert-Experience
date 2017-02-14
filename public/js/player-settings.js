jQuery(document).ready(function(){

    var jsFolder = "../assets/";

    jQuery("#cbsnet_audioplayer").amazingaudioplayer({

        jsfolder:jsFolder,

        volumeimagewidth:22,

        volumeimageheight:21,

        barbackgroundimage:"",

        showtime:true,

        titleinbarwidth:80,

        showprogress:true,

        random:false,

        titleformat:"%TITLE%",

        height:600,

        prevnextimage:"",

        showinfo:true,

        skin:"DarkBox",

        loopimage:"loop.png",

        loopimagewidth:24,

        loopimageheight:24,

        volumebarheight:72,

        prevnextimageheight:45,

        infoformat:"By %ARTIST% %ALBUM%<br />%INFO%",

        showstop:false,

        showvolumebar:true,

        showtitleinbar:false,

        showloop:false,

        volumeimage:"volume.png",

        playpauseimagewidth:60,

        tracklistitemformat:"%ID%. %TITLE% <span style='float:right;'><a href='http://amazingaudioplayer.com/demo-checkout/?id=%ID%'> %DURATION%</a></span>",

        prevnextimagewidth:45,

        tracklistarrowimage:"next.png",

        playpauseimageheight:60,

        showbackgroundimage:false,

        progresswidthmode:"fixed",

        showvolume:true,

        playpauseimage:"play.png",

        showprevnext:true,

        backgroundimage:"",

        volumebarpadding:8,

        progressheight:8,

        showtracklistbackgroundimage:false,

        showtitle:true,

        tracklistarrowimageheight:16,

        heightmode:"auto",

        titleinbarformat:"%TITLE%",

        showtracklist:true,

        stopimageheight:24,

        stopimagewidth:24,

        tracklistbackgroundimage:"",

        showbarbackgroundimage:false,

        showimage:true,

        tracklistarrowimagewidth:16,

        timeformat:"%CURRENT% / %DURATION%",

        autoplay:false,

        loop:1,

        tracklistitem:10

    });

});