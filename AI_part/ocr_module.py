import os
os.environ["PADDLEOCR_HOME"] = r"D:\final\AI service\Evalify-main\root\.paddlex"
os.environ["PADDLE_PDX_MODEL_SOURCE"] = "BOS"

# pyrefly: ignore [missing-import]
from paddleocr import PaddleOCR
# pyrefly: ignore [missing-import]
from spellchecker import SpellChecker

BASE = r"D:\final\AI service\Evalify-main\root\.paddlex\official_models"

ocr = PaddleOCR(
    use_doc_orientation_classify=False,
    use_doc_unwarping=False,
    use_textline_orientation=False,
    text_detection_model_dir=rf"{BASE}\PP-OCRv5_server_det\inference",
    text_recognition_model_dir=rf"{BASE}\PP-OCRv5_server_rec_infer",
    det_db_thresh=0.2,        # ← أقل عشان يشوف أكتر
    det_db_box_thresh=0.4,    # ← أقل عشان يشوف أكتر
    det_db_unclip_ratio=2.0,  # ← أكبر عشان يوسع الـ boxes
)

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