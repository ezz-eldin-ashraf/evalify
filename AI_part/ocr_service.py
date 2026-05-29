# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from ocr_module import extract_text_from_image
import requests
import base64
import tempfile
import os
from PIL import Image as PILImage  # pyrefly: ignore [missing-import]

app = Flask(__name__)

@app.route('/ocr', methods=['POST'])
def ocr():
    image_path = request.json['image_path']
    text = extract_text_from_image(image_path)
    return jsonify({'text': text})

@app.route('/evaluate', methods=['POST'])
def evaluate():
    data = request.json

    if not data or 'image_base64' not in data or 'model_answer' not in data:
        return jsonify({'success': False, 'error': 'image_base64 and model_answer are required'}), 400

    image_bytes = base64.b64decode(data['image_base64'])
    model_answer = data['model_answer']
    max_score = float(data.get('max_score', 10))
    mode = data.get('mode', 'meaning')

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            tmp.write(image_bytes)
            tmp_path = tmp.name

        student_answer = extract_text_from_image(tmp_path)

        if not student_answer or not student_answer.strip():
            return jsonify({'success': False, 'error': 'OCR returned empty text', 'extracted_text': ''}), 422

        grade_response = requests.post('http://localhost:5002/grade', json={
            'model_answer': model_answer,
            'student_answer': student_answer,
            'max_score': max_score,
            'mode': mode
        }, timeout=180)

        grade_response.raise_for_status()
        result = grade_response.json()

        return jsonify({
            'success': True,
            'grade': result['final_score'],
            'extracted_text': student_answer,
            'tfidf_score': result.get('tfidf_score'),
            'embedding_score': result.get('embedding_score'),
            'final_similarity': result.get('final_similarity'),
            'max_score': result['max_score'],
            'mode': result['mode']
        })

    except requests.exceptions.ConnectionError:
        return jsonify({'success': False, 'error': 'ML grading service is not reachable'}), 503

    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': 'ML grading service timed out'}), 504

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == '__main__':
    def warmup_ocr():
        # pyrefly: ignore [parse-error]
        print("Warming up OCR model...")
        try:
            # pyrefly: ignore [missing-import]
            from PIL import ImageDraw, ImageFont
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
                img = PILImage.new('RGB', (400, 100), color='white')
                draw = ImageDraw.Draw(img)
                draw.text((10, 10), "Warming up the OCR model with sample text", fill='black')
                img.save(tmp.name)
                tmp_path = tmp.name
            extract_text_from_image(tmp_path)
            os.remove(tmp_path)
            print("OCR model ready.")
        except Exception as e:
            print(f"Warmup failed: {e}")

    warmup_ocr()
    app.run(port=5001, threaded=True, request_handler=None)