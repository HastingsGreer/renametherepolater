from example_output import example_json
from logger import Logger
from game import Game

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
server_logger = Logger("server.log", "")

player1_joined = False
player2_joined = False

player1_executed = False
player2_executed = False
partial_cmds = {}

map = example_json()
game = Game(map)

@app.route('/')
def home():
    return render_template("index.html")

@socketio.on('join')
def join():
    global player1_joined, player2_joined
    global map
    server_logger.log("Client connected")
    if not player1_joined:
        player_id = 0
        player1_joined = True
    else:
        player_id = 1
        player2_joined = True

    emit("connection_received", {'player_id': player_id, 'map': map})

    if player2_joined:
        emit("game_start", broadcast=True)

# once both players runs execute, we actually execute the command
@socketio.on('execute')
def execute(data):
    global game, player1_executed, player2_executed, partial_cmds
    if not player1_executed:
        partial_cmds = data
        player1_executed = True
    else:
        player2_executed = True
        partial_cmds['moves'].extend(data['moves'])
        partial_cmds['attacks'].extend(data['attacks'])

    emit("execution_ack")
    if player2_executed:
        resp = game.execute(partial_cmds)
        player1_executed = False
        player2_executed = False
        partial_cmds = {}
        emit("exec_result", resp, broadcast=True)

@socketio.on('disconnect')
def disconnect():
    emit("client_disconnected", broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
