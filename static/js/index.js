
function mapSelection() {
    var container = document.getElementById("container");
    var startScreen = document.getElementById("start_screen");
    startScreen.parentNode.removeChild(startScreen)
    var mapSelection = document.createElement("img");
    mapSelection.setAttribute('src', 'static/assets/yeech.png');
    mapSelection.setAttribute('id' , 'yeech')
    container.appendChild(mapSelection);
    document.querySelector('#yeech').addEventListener('click', characterSelection);
}

function characterSelection() {
    var html = '<textarea id="startUnits" rows="30" cols="50">' + 
               '{"units": [{ "type": "flower_girl"}, { "type": "normie"}]}' + 
               '</textarea>' + 
               '<button id="startingUnits" onclick="startingUnits()"> Starting Units </button>';
        
    var container = document.getElementById("container");
    var yeech = document.getElementById("yeech");
    yeech.parentNode.removeChild(yeech)
    container.innerHTML = html;
}
