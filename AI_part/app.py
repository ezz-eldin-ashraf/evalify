import requests

image_path = r"D:\Grad_test\test2.jpg"
model_answer = "Image Segmentation is the process of dividing an image into different regions or objects to simplify image analysis and help identify important parts of the image"

# OCR
ocr_res = requests.post('http://localhost:5001/ocr', json={'image_path': image_path})
student_answer = ocr_res.json()['text']
print("OCR:", student_answer)

# Grade
grade_res = requests.post('http://localhost:5002/grade', json={
    'model_answer': model_answer,
    'student_answer': student_answer,
    'max_score': 10,
    'mode': 'strict'
})
print("RESULT:", grade_res.json())