var jsonMapper = {
    "placeholder" : 0,
    "flower_girl" : 1,
    "treebuchet" : 2,
    "therapist" : 3,
    "dirt" : 1,
    "grass" : 2, 
    "tree" : 3, 
    "flower" : 4
}
var maps;
var socket = io();
socket.on('connect', function() {
    socket.emit('join');
});

socket.on("connection_received", function(data) {
    console.log(data);
    fill_table(data);
    maps = parseGameData(data);
});

socket.on("exec_result", function(data) {
    console.log(data);
    fill_table(data);
    maps = parseGameData(data);
    console.log(maps);
    document.getElementById("tempMap").innerHTML = data;
});

function sendAction() {
    var action = document.getElementById("inputAction").value;
    socket.emit('execute', action);
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
                groundRow['row'] += jsonMapper[curr["environment"]["background"]];
                if(jsonMapper[curr["unit"].type]) {
                    objectRow['row'] += jsonMapper[curr["unit"].type];
                } else {
                    objectRow['row'] += "0";
                }
            } else {
                groundRow['row'] += jsonMapper[curr["environment"]["background"]] + " ,";
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

function updateMapData() {

}