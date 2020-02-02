function mapSelection() {

    var html = '<textarea id="mapSelect" rows="30" cols="50">' + 
    '{ "map": [ \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "water", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "water", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "water", "dirt", "dirt", "dirt"]}, \
        {"row": ["dirt", "dirt", "dirt", "dirt", "dirt", "dirt"]} \
    ]}' + 
    '</textarea>' +
    '<br>' +
    '<button id="characterSelection" onclick="goToCharSel()"> Select Characters </button>';

    var container = document.getElementById("container");
    var startScreen = document.getElementById("start_screen");
    startScreen.parentNode.removeChild(startScreen)

    container.innerHTML = html;
}