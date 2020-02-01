import jsonMapper from './jsonMapper.js'

var socket = io();
socket.on('connect', function() {
    socket.emit('join');
});

socket.on("connection_received", function(data) {
    console.log(data);
    fill_table(data);
});

socket.on("exec_result", function(data) {
    console.log(data);
    fill_table(data);
    var maps = parseGameData(data);
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
                objectRow['row'] += jsonMapper[curr["unit"].type];
            } else {
                groundRow['row'] += jsonMapper[curr["environment"]["background"]] + " ,";
                objectRow['row'] += jsonMapper[curr["unit"].type] + " ,";
            }
        }
        map["groundMap"].push(groundRow);
        map["objectsMap"].push(objectRow);
    }
    return map;
} 