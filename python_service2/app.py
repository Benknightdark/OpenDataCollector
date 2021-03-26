import math
import sys
from flask import Flask, request, abort, render_template, jsonify, make_response
from flask_cors import CORS
from pytube import YouTube

app = Flask(__name__)
CORS(app)


# @app.route('/multiply', methods=['POST'])
# def multiply():
#     content = request.json
#     [operand_one, operand_two] = [
#         float(content['operandOne']), float(content['operandTwo'])]
#     print(f"Calculating {operand_one} * {operand_two}", flush=True)
#     return jsonify(math.ceil(operand_one * operand_two * 100000)/100000)


@app.route('/hi2', methods=['GET'])
def hi():
    return "hi2"
@app.route('/download', methods=['GET'])

def download():
    YouTube('https://youtu.be/2lAe1cqCOXo').streams.first().download()
    yt = YouTube('http://youtube.com/watch?v=2lAe1cqCOXo')
    yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first().download()
    return "ok"

if __name__ == "__main__":
    app.run()
