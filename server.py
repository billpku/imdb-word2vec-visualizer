from flask import Flask, jsonify
from flask.ext.cors import CORS

app = Flask(__name__)

CORS(app)

from gensim.models import word2vec
model = word2vec.Word2Vec.load("300features_40minwords_10context")

@app.route("/similarity/<word>")
def similarity(word):
  try:
    result = model.most_similar(word);
  except KeyError:
    return jsonify({'error': 'Not Found!'}), 500

  return jsonify(result)

if __name__ == "__main__":
  app.run(debug = True, port = 8080, threaded=True)