import os
import sys

ai_part_dir = os.path.dirname(os.path.abspath(__file__))
paddlex_home = os.path.join(ai_part_dir, "OCR MODEL", "root", ".paddlex")

os.environ["PADDLEOCR_HOME"] = paddlex_home
os.environ["PADDLE_PDX_MODEL_SOURCE"] = "BOS"

# pyrefly: ignore [missing-import]
from paddleocr import PaddleOCR
# pyrefly: ignore [missing-import]
from spellchecker import SpellChecker

BASE = os.path.join(paddlex_home, "official_models")
det_dir = os.path.join(BASE, "PP-OCRv5_server_det", "inference")
rec_dir = os.path.join(BASE, "PP-OCRv5_server_rec_infer")

ocr_kwargs = {
    "use_doc_orientation_classify": False,
    "use_doc_unwarping": False,
    "use_textline_orientation": False,
    "det_db_thresh": 0.2,
    "det_db_box_thresh": 0.4,
    "det_db_unclip_ratio": 2.0
}

# Use local models only if the directories actually exist
if os.path.exists(det_dir) and os.path.exists(rec_dir):
    ocr_kwargs["text_detection_model_dir"] = det_dir
    ocr_kwargs["text_recognition_model_dir"] = rec_dir

ocr = PaddleOCR(**ocr_kwargs)

spell = SpellChecker()

def correct_spelling(text):
    words = text.split()
    corrected = []

    for word in words:

        # سيب الاختصارات والكلمات الكبيرة
        if word.isupper() or len(word) <= 2:
            corrected.append(word)
            continue

        if word.lower() in spell:
            corrected.append(word)
        else:
            corrected_word = spell.correction(word)
            corrected.append(corrected_word if corrected_word else word)

    return " ".join(corrected)

def extract_text_from_image(image_path):
    result = ocr.predict(image_path)
    text = ""
    for res in result:
        texts = res.get("rec_texts", [])
        scores = res.get("rec_scores", [])
        for t, s in zip(texts, scores):
            if s > 0.5:
                text += t + " "
    
    text = correct_spelling(text.strip())  # ← تصحيح بعد OCR
    return text