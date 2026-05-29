# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from embedding_module import embedding_model
from grading_module import grade_answer, tfidf_similarity
import numpy as np

app = Flask(__name__)

def convert(obj):
    if isinstance(obj, (np.float32, np.float64)): return float(obj)
    if isinstance(obj, (np.int32, np.int64)): return int(obj)
    if isinstance(obj, dict): return {k: convert(v) for k, v in obj.items()}
    if isinstance(obj, list): return [convert(i) for i in obj]
    return obj

@app.route('/grade', methods=['POST'])
def grade():
    data = request.json
    result = grade_answer(
        embedding_model,
        data['model_answer'],
        data['student_answer'],
        tfidf_similarity,
        max_score=data.get('max_score', 10),
        mode=data.get('mode', 'meaning')
    )
    return jsonify(convert(result))

if __name__ == '__main__':
    # Warm up the embedding model on startup
    print("Warming up embedding model...")
    try:
        embedding_model.encode(["warmup"])
        print("Embedding model ready.")
    except Exception as e:
        print(f"Embedding warmup failed: {e}")

    app.run(port=5002, threaded=False)