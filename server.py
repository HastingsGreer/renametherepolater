



from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/index/')
def home():
    return "HELLO"

if __name__ == '__main__':
    socketio.run(app)
