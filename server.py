from example_output import example_json
from logger import Logger
from game import Game
from attacks import make_unit
from map import generate_initial_map

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
server_logger = Logger("server.log", "")

players = {}

map = example_json()
game = Game(map['board'])

@app.route('/')
def home():
    return render_template("index.html")

@socketio.on('connect')
def join():
    global map
    players[request.sid] = {
        'id' : len(list(players.keys())),
        'playerId' : request.sid,
        'units' : [],
        'currMove' : {}
    }
    print("Client")
    server_logger.log("Client connected")

    emit("connection_received", {'player_id' : players[request.sid]['id']})

    if len(list(players.keys())) == 2:
        print("game start")
        emit("allPlayersConnected", broadcast=True)

@socketio.on('disconnect')
def disconnect():   
    print('Client disconnected')
    del players[request.sid]
    print(players)
    emit("client_disconnected", broadcast=True)

# once both players runs execute, we actually execute the command
@socketio.on('execute')
def execute(data):
    if not players[request.sid]['units']:
        print("Player " + str(players[request.sid]['id']) + " has not selected any units")
        return
    if players[request.sid]['currMove']:
        print("Player " + str(players[request.sid]['id']) + " has already executed a move")
        return
    global game
    data = json.loads(data)
    unit_locs, unit_data = game._gather_unit_information()

    for move in data['moves']:
        if unit_data[move['id']]['owner'] != players[request.sid]['id']:
            print("cannot move that unit")
            return
    players[request.sid]['currMove'] = data

    allMoved = True
    for player in players.values():
        if not player['currMove']:
            allMoved = False
    emit("execution_ack")

    if allMoved:   
        cmd = players[request.sid]['currMove']
        for player in players.values():
            if player['playerId'] != request.sid:
                cmd['moves'].extend(player['currMove']['moves'])
                cmd['attacks'].extend(player['currMove']['attacks'])
            player['currMove'] = {}
        resp = game.execute(cmd)
        emit("exec_result", {'map': resp}, broadcast=True)

@socketio.on('startingUnit')
def startingUnit(data):
    units = []
    data = json.loads(data)
    for unit in data['units']:
        units.append(make_unit(unit['type'], players[request.sid]['id']))
    print(units)
    players[request.sid]['units'] = units

    allSelected = True

    player_units = []
    for player in players.values():
        if not player['units']:
            allSelected = False
            break
        player_units.append(player['units'])

    if allSelected:
        player1_units = player_units[0]
        player2_units = player_units[1]
        map = generate_initial_map(8, 8, player1_units, player2_units)
        print("INIT MAP")
        global game
        game = Game(map['map']['board'])

        emit("game_start", map , broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
