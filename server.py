from example_output import example_json
from logger import Logger
from game import Game
from attacks import make_unit
from map import generate_initial_map

from flask import Flask, render_template, request, jsonify, make_response
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS, cross_origin

import json
import os

ASSETS_FOLDER = os.path.join('static', 'assets')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['ASSETS_FOLDER'] = ASSETS_FOLDER
socketio = SocketIO(app)
server_logger = Logger("server.log", "")

players = {}
playerId = 0
activeRooms = {}
roomId = 0

cors = CORS(app, resources={r'/game': {"origins": "http://localhost:5000"}})

map = example_json()
game = Game(map['board'])

units = {}

@app.route('/')
def home():
    trav_config_str = open("./static/map/mapData.json").read()
    return render_template("index.html", trav_config=trav_config_str)

# @app.route('/loadUnits', methods=['POST'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
# def loadUnits():
#     units = request.get_json(force=True)
#     res = make_response(jsonify({"message": "OK"}), 200)
#     return res

@app.route('/game', methods=['GET'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def gamePage():
    return render_template("game.html")


@socketio.on('connect')
def connect():
    global map, playerId, roomId, activeRooms
    if roomId in activeRooms and \
        (len(activeRooms[roomId]['players']) == 0 or len(activeRooms[roomId]['players']) == 2):
        roomId += 1

    players[request.sid] = {
        'id' : playerId,
        'socketId' : request.sid,
        'roomId': roomId,
        'units' : [],
        'currMove' : {},
        'ready' : False
    }
    room = players[request.sid]['roomId']
    join_room(room)
    if roomId in activeRooms:
        activeRooms[roomId]['players'].append(request.sid)
    else:
        activeRooms[roomId] = {'players': [request.sid]}

    print('Player ' + str(playerId) + ' has entered room ' + str(room))
    playerId += 1

    server_logger.log("Client connected")

    emit("connection_received", {'player_id' : players[request.sid]['id']})

    if len(list(players.keys())) == 2:
        print("game start")
        emit("allPlayersConnected", broadcast=True, room=room)

@socketio.on('disconnect')
def disconnect():
    print('Player ' + str(players[request.sid]['id']) + ' has disconnected from room ' + str(players[request.sid]['roomId']))
    room = players[request.sid]['roomId']
    activeRooms[players[request.sid]['roomId']]['players'] = []
    del players[request.sid]
    emit("client_disconnected", broadcast=True, room=room)

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
    for socket in activeRooms[players[request.sid]['roomId']]['players']:
        player = players[socket]
        if not player['currMove']:
            allMoved = False
    emit("execution_ack")

    if allMoved:   
        cmd = players[request.sid]['currMove']
        for socket in activeRooms[players[request.sid]['roomId']]['players']:
            player = players[socket]
            if player['socketId'] != request.sid:
                cmd['moves'].extend(player['currMove']['moves'])
                cmd['attacks'].extend(player['currMove']['attacks'])
            player['currMove'] = {}
        resp = game.execute(cmd)
        emit("exec_result", {'map': resp}, broadcast=True, room=players[request.sid]['roomId'])

@socketio.on('startingUnit')
def startingUnit(data):
    units = []
    data = json.loads(data)
    for unit in data['units']:
        units.append(make_unit(unit['type'], players[request.sid]['id']))
    print(units)
    players[request.sid]['units'] = units
    players[request.sid]['ready'] = True

    bothReady = True

    player_units = []
    for socket in activeRooms[players[request.sid]['roomId']]['players']:
        player = players[socket]
        if not player['ready']:
            bothReady = False
            return
        player_units.append(player['units'])

    if bothReady:
        player1_units = player_units[0]
        player2_units = player_units[1]
        global map
        map = generate_initial_map(5, 7, player1_units, player2_units)
        print("INIT MAP")
        global game
        game = Game(map['map']['board'])

        emit("game_start", map , broadcast=True, room=players[request.sid]['roomId'])

if __name__ == '__main__':
    socketio.run(app, debug=True)
