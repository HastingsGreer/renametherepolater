var jsonMapper = {
    "placeholder" : 0,
    "flower_girl" : 1,
    "treebuchet" : 2,
    "therapist" : 3,
    "bench_boi" : 4,
    "normie" : 5,
    "dirt" : 1,
    "grass" : 2, 
    "tree" : 3, 
    "flower" : 4,
    "bench" : 5
}
var selectedMap;
var socket = io();
socket.on('connect', function() {
    socket.emit('join');    
});

socket.on("client_disconnected", function(){
	alert("Your opponent disconnected. You win I guess. Please reload to start a new match")
})

socket.on("connection_received", function(data) {
    console.log("Im in connection_received");
    console.log(data);
    window.player_id = data.player_id;
});

socket.on("exec_result", function(data) {

    document.getElementById("waitingIndicator").innerHTML = "";
    window.selectMode = -1;

    console.log("Im in exec_result");
    console.log(data);
    fill_table(data);
    renderServerReply(data);
});

socket.on("game_start", async function(data) {
    var container = document.getElementById("container");
    var button = document.getElementById("startingUnits");
    var textArea = document.getElementById("startUnits");
    var p = document.getElementById("pixiContainer");
    p.style.display = "block";

    container.removeChild(button);
    container.removeChild(textArea);

    let response = await fetch('/game' , {
        credentials: 'same-origin',
        mode: 'cors'
    });

    let resp = await response.text();
    container.innerHTML = resp; 
    console.log("game started");
    console.log(data);

    document.getElementById("implayer").innerText = window.player_id;
    fill_table(data);
    renderServerReply(data);
    //serverGameState = data;
});

socket.on("win", function(data) {
    console.log(window.player_id);
    console.log(data['winner']);
    if(window.player_id != data['winner']){
        return
    }
    var container = document.getElementById("container");
    var p = document.getElementById("pixiContainer");

    container.innerHTML = "";
    p.parentNode.removeChild(p);

    var big = document.createElement("div");
    big.appendChild(container);
    container.style.position = "absolute";
    container.style.left = "25%";
    container.style.width = "750px";
    container.style.height = "750px";
    var c3 = document.createElement("c3");
    c3.style.position = "absolute";
    c3.style.top = "375px";
    c3.style.left = "320px";
    container.appendChild(c3);
    var win_text = document.createElement("img");
    win_text.style.width = "111px";
    win_text.style.height = "21px";
    win_text.setAttribute("src", "static/assets/ggj_wintext_white.png");
    win_text.setAttribute("id", "winText");
    c3.appendChild(win_text);
    var c2 = document.createElement("div");
    container.appendChild(c2);
    var win_screen = document.createElement("img");
    win_screen.style.width = "100%";
    win_screen.style.height = "100%";
    win_screen.setAttribute("src", "static/assets/ggj_winscreen.png");
    c2.appendChild(win_screen);
    document.body.appendChild(big);

    endScreen();
});

function sendAction() {
	document.getElementById("waitingIndicator").innerHTML = "<b> WAITING_ON_OTHER_PLAYER </b>";
    var action = document.getElementById("inputAction").value;
    socket.emit('execute', action);
}
    
function startingUnits() {
    var units = document.getElementById('startUnits').value;
    var selectedMap = window.map_select_json;
    socket.emit('startingUnit', { 'units':JSON.parse(units), 'selectedMap':JSON.parse(selectedMap) });
    // socket.emit('startingUnit', units);
}

function goToCharSel() {
    selectedMap = document.getElementById('mapSelect').value;
    var html = '<textarea id="startUnits" rows="30" cols="50">' + 
    '{"units": [{ "type": "flower_girl"}, { "type": "normie"}' + 
    ',{ "type": "bench_boi"} ' + 
    ',{ "type": "therapist"}, { "type": "treebuchet"}]}' + 
    '</textarea>' + 
    '<br>' + 
    '<button id="startingUnits" onclick="startingUnits()"> Starting Units </button>';

    var container = document.getElementById("container");
    var mapSelTextArea = document.getElementById("mapSelect");

    window.map_select_json = mapSelTextArea.value;
    mapSelTextArea.parentNode.removeChild(mapSelTextArea);
    charSelection = document.getElementById("characterSelection");
    charSelection.parentNode.removeChild(charSelection);

    container.innerHTML = html;
    // bgm.Play("sad_song.mp3", 0.5, true);
    sfx.Initialize();
    bgm.Initialize();

    ambience.Initialize();
    ambience.Play("AmbientSFX_Forest_1.mp3", 0.5, true);
}



window.onbeforeunload = function(e) {
  socket.disconnect();
};
