from sentence_transformers import SentenceTransformer

# =========================
# 3. EMBEDDING MODEL (QWEN LOCAL)
# =========================
embedding_model = SentenceTransformer(
     r"D:\final\AI service\Evalify-main\qwen_embedding_model"
)
def get_embedding(text):
    return embedding_model.encode([text])