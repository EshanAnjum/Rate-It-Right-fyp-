# Other/rag_engine.py

import pandas as pd
import torch
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from sklearn.metrics.pairwise import cosine_similarity




# Load models once
# mini LM for vector embeddings and flan for answers generation.
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
flan_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
flan_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

def load_reviews_from_excel(file_path):
    print("inside rag read file")
    print("file path to read" , file_path)
    df = pd.read_csv(file_path)
    print("file read successfully")
    if 'review_text' not in df.columns:
        raise ValueError("Excel file must contain a 'review' column.")
    return df['review_text'].dropna().tolist()



# With cache
def generate_answer(product, question, review_source, top_k=5):
    print("📥 Inside generate_answer — preprocessing input")

    try:
        # If review_source is a DataFrame, use it directly
        if isinstance(review_source, pd.DataFrame):
            df = review_source
        else:
            # Otherwise, assume it's a file-like object and try to load it
            df = pd.read_csv(review_source)

        if 'review_text' not in df.columns:
            raise ValueError("Data must contain a 'review_text' column.")

        reviews = df['review_text'].dropna().tolist()
        if not reviews:
            return "No valid reviews found in the dataset."

    except Exception as e:
        print(f"❌ Error preparing reviews: {e}")
        return f"Failed to process review data: {str(e)}"

    # ✅ Encode reviews and question
    print("🔍 Encoding reviews and question")
    review_embeddings = embedding_model.encode(reviews, convert_to_tensor=True)
    question_embedding = embedding_model.encode([question], convert_to_tensor=True)

    # ✅ Compute similarity using cosine similarity
    similarities = cosine_similarity(question_embedding, review_embeddings)[0]
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    context = " ".join([reviews[i] for i in top_indices])

    # ✅ Build prompt and generate answer
    prompt = (
        f"You are a helpful assistant. Based on the following product reviews, provide a detailed and informative answer:\n\n"
        f"{context}\n\n"
        f"Question: {question}\n"
        f"Answer:"
    )

    inputs = flan_tokenizer(prompt, return_tensors="pt", truncation=True)
    outputs = flan_model.generate(**inputs, max_new_tokens=150)
    answer = flan_tokenizer.decode(outputs[0], skip_special_tokens=True)

    return answer
