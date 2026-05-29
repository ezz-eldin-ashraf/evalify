from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import math
import re

# =========================
# 1. PREPROCESS 
# =========================
def preprocess(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text
# =========================
# 5. TF-IDF SIMILARITY FUNCTION
# =========================
def tfidf_similarity(model_answer, student_answer):
    model_answer = preprocess(model_answer)
    student_answer = preprocess(student_answer)

    vectorizer = TfidfVectorizer()
    corpus = [model_answer, student_answer]

    tfidf_matrix = vectorizer.fit_transform(corpus)

    tf_idf_sim = float(cosine_similarity(    
        tfidf_matrix[0:1],
        tfidf_matrix[1:2]
    )[0][0])

    return round(tf_idf_sim, 4)

def has_opposite_meaning(model_ans, student_ans):
    opposite_pairs = [
        ("increase", "decrease"),
        ("minimize", "maximize"),
        ("minimizes", "increases"),
        ("true", "false"),
        ("positive", "negative")
    ]
    model_ans = model_ans.lower()
    student_ans = student_ans.lower()
    for w1, w2 in opposite_pairs:
        if w1 in model_ans and w2 in student_ans:
            return True
        if w2 in model_ans and w1 in student_ans:
            return True
    return False

# =========================
# 6. YOUR FULL GRADING FUNCTION 
# =========================
def grade_answer(model, model_ans, student_ans, tfidf_func, max_score, mode):

    model_ans =(model_ans)
    student_ans =(student_ans)

    tf_idf_score = tfidf_func(model_ans, student_ans)

    model_ans_embedding = model.encode([model_ans])
    student_ans_embedding = model.encode([student_ans])

    embedding_similarity = float(cosine_similarity(
    model_ans_embedding,
    student_ans_embedding
)[0][0])

    GRADING_MODES = {
        "strict": {"embedding_weight": 0.5, "tfidf_weight": 0.5},
        "meaning": {"embedding_weight": 0.9, "tfidf_weight": 0.1}
    }

    config = GRADING_MODES[mode]

    emb_w = config["embedding_weight"]
    tfidf_w = config["tfidf_weight"]

    if mode == "meaning":
        MIN_SIMILARITY_THRESHOLD = 0.50
        THRESHOLD_FULL_MARK = 0.85
    else:
        MIN_SIMILARITY_THRESHOLD = 0.65
        THRESHOLD_FULL_MARK = 0.95
    
    if has_opposite_meaning(model_ans, student_ans):
        final_score = 0
        final_similarity = embedding_similarity

    if embedding_similarity < MIN_SIMILARITY_THRESHOLD:
        final_score = 0
        final_similarity = embedding_similarity

    elif embedding_similarity >= THRESHOLD_FULL_MARK:
        final_score = max_score
        final_similarity = embedding_similarity

    else:
        final_similarity = (
            emb_w * embedding_similarity +
            tfidf_w * tf_idf_score
        )

        final_score = math.ceil(final_similarity * max_score * 2) / 2

    return {
    "tfidf_score": float(round(tf_idf_score, 4)),
    "embedding_score": float(round(embedding_similarity, 4)),
    "final_similarity": float(round(final_similarity, 4)),
    "final_score": float(final_score),
    "max_score": float(max_score),
    "mode": mode
}