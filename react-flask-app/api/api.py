import time
from flask import Flask, request

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/date')
def get_date():
    return {'date': 'Monday'}

@app.route('/demo', methods=['POST'])
def demo():
    file_name = request.get_json()['name']
    print(file_name)
    return {'demo': file_name}
