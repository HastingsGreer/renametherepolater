function mapSelection() {

    var html = '<textarea id="mapSelect" rows="30" cols="50">' + 
    '{ "map": [ \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "water", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "water", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt"]} \
    ]}' + 
    '</textarea>' +
    '<br>' +
    '<button id="characterSelection" onclick="goToCharSel()"> Select Characters </button>';

    var container = document.getElementById("container");
    var startScreen = document.getElementById("fauxContainer");
    startScreen.parentNode.removeChild(startScreen)

    container.innerHTML = html;

    bgm.Play("happy_song.mp3", 0.14, true);
    ambience.Play("AmbientSFX_Forest_1.mp3", 0.11, true);
}

function startTextRed() {
     var start_text = document.getElementById('start_text');
     start_text.setAttribute('src', 'static/assets/ggj_start_red.png');
}

function startTextWhite() {
     var start_text = document.getElementById('start_text');
     start_text.setAttribute('src', 'static/assets/ggj_start_white.png');
}


var count = 1;
function endScreen() {
    var intervalID = window.setInterval(flash, 500);

}

function flash() {
    var winText = document.getElementById("winText");
    if (count == 1){
        winText.setAttribute("src", "static/assets/ggj_wintext_white.png");
    } else {
        winText.setAttribute("src", "static/assets/ggj_wintext_green.png");
    }
    count++;
}
