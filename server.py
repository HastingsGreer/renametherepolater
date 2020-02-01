

from example_output import example_json
from logger import Logger


from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
server_logger = Logger("server.log", "")

player1_joined = False

@app.route('/')
def home():
    return render_template("index.html")

@socketio.on('join')
def join():
    global player1_joined
    server_logger.log("Client connected")
    if not player1_joined:
        player_id = 0
        player1_joined = True
    else:
        player_id = 1

    emit("connection_received", {'player_id': player_id, 'map': example_json()})

# once both players runs execute, we actually execute the command
@socketio.on('execute')
def execute(data):
    pass

@socketio.on('disconnect')
def disconnect():
    emit("client_disconnected")

if __name__ == '__main__':
    socketio.run(app, debug=True)
