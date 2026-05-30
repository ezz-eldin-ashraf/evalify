from sentence_transformers import SentenceTransformer
import os

# =========================
# 3. EMBEDDING MODEL (QWEN LOCAL)
# =========================
ai_part_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(ai_part_dir, "ML MODEL", "qwen_embedding_model")

# If the local path doesn't exist, fallback to HuggingFace Hub
if not os.path.exists(model_path):
    model_path = "Alibaba-NLP/gte-Qwen2-1.5B-instruct" # or whatever the huggingface model is, but it's likely a sentence transformer

embedding_model = SentenceTransformer(model_path)
def get_embedding(text):
    return embedding_model.encode([text])