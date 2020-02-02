
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

    // var mapSelection = document.createElement("img");
    // mapSelection.setAttribute('src', 'static/assets/yeech.png');
    // mapSelection.setAttribute('id' , 'yeech')
    // container.appendChild(mapSelection);
    // document.querySelector('#yeech').addEventListener('click', characterSelection);
}

// function characterSelection() {

//     var html = '<textarea id="startUnits" rows="30" cols="50">' + 
//                '{"units": [{ "type": "flower_girl"}, { "type": "normie"}]}' + 
//                '</textarea>' + 
//                '<button id="startingUnits" onclick="startingUnits()"> Starting Units </button>';
        
//     var container = document.getElementById("container");
//     // var yeech = document.getElementById("yeech");
//     // yeech.parentNode.removeChild(yeech)

//     container.innerHTML = html;
// }

