import requests
import time

image_path = "D:\\Grad_test\\IR.png"
model_answer = "The possible ways for index representation are term document matrix and inverted index."

start = time.time()
ocr_res = requests.post('http://localhost:5001/ocr', json={'image_path': image_path})
print(f"OCR time: {time.time() - start:.2f}s")

start = time.time()
grade_res = requests.post('http://localhost:5002/grade', json={
    'model_answer': model_answer,
    'student_answer': ocr_res.json()['text'],
    'max_score': 10,
    'mode': 'meaning'
})
print(f"Grade time: {time.time() - start:.2f}s")
print("RESULT:", grade_res.json())