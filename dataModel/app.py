from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
import faiss
import os
import torch
from transformers import BertTokenizer, BertModel

app = Flask(__name__)

DATA_FOLDER = "data"
CSV_FILE = os.path.join(DATA_FOLDER, "merged_volume.csv")
INDEX_FILE = os.path.join(DATA_FOLDER, "nco_bert_faiss.index")

# ===================== Load Data =====================
print("Loading dataset...")
df = pd.read_csv(CSV_FILE)
df = df.drop(columns=["title_y"])
cols_to_convert = ['Division_code', 'Subdivision_Code', 'Group_Code', 'Family_Code', 'title_Code', '2004_code']
df[cols_to_convert] = df[cols_to_convert].astype(str)
df = df.astype(str)
df['2015_nco_data'] = df.astype(str).agg(' '.join, axis=1)

# ===================== Load BERT =====================
print("Loading BERT model...")
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
model.eval()

def get_bert_embeddings_batch(texts, batch_size=16):
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i+batch_size]
        inputs = tokenizer(batch_texts, return_tensors='pt', max_length=512, truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
        batch_embeddings = outputs.pooler_output.cpu().numpy()
        all_embeddings.extend(batch_embeddings)
    return all_embeddings

def get_bert_embedding(text):
    return get_bert_embeddings_batch([text])[0]

# ===================== Load or Build FAISS =====================
if os.path.exists(INDEX_FILE):
    print("Loading FAISS index from disk...")
    index = faiss.read_index(INDEX_FILE)
    
    if 'bert_embedding' not in df.columns:
        print("Generating embeddings from saved index is not possible, recomputing...")
        embeddings = get_bert_embeddings_batch(df['2015_nco_data'].tolist())
        df['bert_embedding'] = embeddings
else:
    print("Building FAISS index...")
    embeddings = get_bert_embeddings_batch(df['2015_nco_data'].tolist())
    df['bert_embedding'] = embeddings
    embedding_matrix = np.vstack(df['bert_embedding'].values).astype('float32')
    faiss.normalize_L2(embedding_matrix)
    index = faiss.IndexFlatIP(embedding_matrix.shape[1])
    index.add(embedding_matrix)
    faiss.write_index(index, INDEX_FILE)
    print(f"Index saved to {INDEX_FILE}")

# ===================== Search Helpers =====================
def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def format_score_as_percent(score):
    return f"{int(round(score * 100))}%"

def search_nco_data(user_input, df, index, top_k=5):
    user_input = user_input.strip()
    results = []
    user_embedding = get_bert_embedding(user_input)
    user_embedding = user_embedding / np.linalg.norm(user_embedding)

    # Exact match on title_Code
    exact_code_matches = df[df['title_Code'].str.strip() == user_input]
    if not exact_code_matches.empty:
        for _, row in exact_code_matches.iterrows():
            row_emb = row['bert_embedding']
            row_emb = row_emb / np.linalg.norm(row_emb)
            score = cosine_sim(user_embedding, row_emb)
            results.append({
                'Title_Code': row['title_Code'],
                'Title': row['title_x'],
                'Score': format_score_as_percent(score),
                'Description': row['Description'][:500] + '...'
            })
        return results

    # Exact match on title (case-insensitive)
    exact_title_matches = df[df['title_x'].str.lower().str.strip() == user_input.lower()]
    if not exact_title_matches.empty:
        for _, row in exact_title_matches.iterrows():
            row_emb = row['bert_embedding']
            row_emb = row_emb / np.linalg.norm(row_emb)
            score = cosine_sim(user_embedding, row_emb)
            results.append({
                'Title_Code': row['title_Code'],
                'Title': row['title_x'],
                'Score': format_score_as_percent(score),
                'Description': row['Description'][:500] + '...'
            })
        return results

    # Match on Division_code, Group_Code, Subdivision_Code
    exact_div_matches = df[(df['Division_code'].str.strip() == user_input) |
                           (df['Group_Code'].str.strip() == user_input) |
                           (df['Subdivision_Code'].str.strip() == user_input)]
    if not exact_div_matches.empty:
        for _, row in exact_div_matches.iterrows():
            row_emb = row['bert_embedding']
            row_emb = row_emb / np.linalg.norm(row_emb)
            score = cosine_sim(user_embedding, row_emb)
            results.append({
                'Title_Code': row['title_Code'],
                'Title': row['title_x'],
                'Score': format_score_as_percent(score),
                'Description': row['Description'][:500] + '...'
            })
        return results

    
    index.nprobe = 10
    D, I = index.search(np.array([user_embedding]).astype('float32'), top_k)
    for dist, idx in zip(D[0], I[0]):
        row = df.iloc[idx]
        score = dist
        results.append({
            'Title_Code': row['title_Code'],
            'Title': row['title_x'],
            'Score': format_score_as_percent(score),
            'Description': row['Description'][:500] + '...'
        })

    return results

# ===================== Routes =====================
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/active", methods=["GET"])
def active():
    return "active"

@app.route("/search", methods=["GET"])
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "Please provide a query"}), 400
    matches = search_nco_data(query, df, index, top_k=5)
    return jsonify(matches)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  
    app.run(debug=True, host='0.0.0.0', port=port)
