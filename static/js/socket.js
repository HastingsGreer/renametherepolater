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
var maps;
var socket = io();
socket.on('connect', function() {
    socket.emit('join');    
});

socket.on("client_disconnected", function(){
	alert("Your opponent disconnected. You win I guess")
})

socket.on("connection_received", function(data) {
    console.log("Im in connection_received");
    console.log(data);
    window.player_id = data.player_id;
});

socket.on("exec_result", function(data) {

    document.getElementById("waitingIndicator").innerHTML = "";
    window.selectMode = 0;

    console.log("Im in exec_result");
    console.log(data);
    fill_table(data);
    renderServerReply(data);
    maps = parseGameData(data);
    console.log(maps);
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

function sendAction() {
	document.getElementById("waitingIndicator").innerHTML = "<b> WAITING_ON_OTHER_PLAYER </b>";
    var action = document.getElementById("inputAction").value;
    socket.emit('execute', action);
}
    
function startingUnits() {
    var units = document.getElementById('startUnits').value;
    socket.emit('startingUnit', units);
}

function parseGameData(gameData) {
    var board = gameData['map']['board']
    var map = {}
    map["groundMap"] = []
    map["objectsMap"] = []
    for(var i = 0; i < board.length; i++) {
        var groundRow = {};
        var objectRow = {};
        groundRow['row'] = "";
        objectRow['row'] = "";
        for(var j = 0; j < board[1].length; j++) {
            var curr = board[i][j];
            if(j == board[1].length - 1) {
                groundRow['row'] += jsonMapper[curr["background"]];
                if(jsonMapper[curr["unit"].type]) {
                    objectRow['row'] += jsonMapper[curr["unit"].type];
                } else {
                    objectRow['row'] += "0";
                }
            } else {
                groundRow['row'] += jsonMapper[curr["background"]] + " ,";
                if(jsonMapper[curr["unit"].type]) {
                    objectRow['row'] += jsonMapper[curr["unit"].type] + " ,";
                } else {
                    objectRow['row'] += "0 ,";
                }
                
            }
        }
        map["groundMap"].push(groundRow);
        map["objectsMap"].push(objectRow);
    }
    return map;
} 


window.onbeforeunload = function(e) {
  socket.disconnect();
};
