from flask import Flask
from flask_cors import CORS

app = Flask(__name__, static_folder='../static', static_url_path='/')
CORS(app)

from main import routes