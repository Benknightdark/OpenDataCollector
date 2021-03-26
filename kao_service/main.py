import math
import sys
from flask import Flask, request, abort, render_template, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/multiply', methods=['POST'])
def multiply():
    content = request.json
    [operand_one, operand_two] = [
        float(content['operandOne']), float(content['operandTwo'])]
    print(f"Calculating {operand_one} * {operand_two}", flush=True)
    return jsonify(math.ceil(operand_one * operand_two * 100000)/100000)


@app.route('/hi', methods=['GET'])
def hi():
    return "hi1"


if __name__ == "__main__":
    app.run()
