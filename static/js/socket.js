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
});

function sendAction() {
    var action = document.getElementById("inputAction").value;
    socket.emit('execute', action);
}