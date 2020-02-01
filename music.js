$(document).ready(function(){ 

    var allAudioEls = $('audio');

    function pauseAllAudio() {
       allAudioEls.each(function() {
          var a = $(this).get(0);
          a.pause();
       });
    }


    $("#play-bt").click(function(){
        pauseAllAudio();
        $("#audio-player")[0].play();
    })

    $("#stop-bt").click(function(){
        $("#audio-player")[0].pause();
        $("#audio-player")[0].currentTime = 0;
    })

    $("#play-bt1").click(function(){
        pauseAllAudio();
        $("#audio-player1")[0].play();
    })

    $("#stop-bt1").click(function(){
        $("#audio-player1")[0].pause();
        $("#audio-player1")[0].currentTime = 0;
    })
})