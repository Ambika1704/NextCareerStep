import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

app = Flask(__name__)
CORS(app)

# Initialize Gemini Client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
if GEMINI_API_KEY:
    print(f"DEBUG: Loaded Gemini API Key starting with: {GEMINI_API_KEY[:7]}...")
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
else:
    model = None

# Load Dataset
df = pd.read_csv("jobs.csv")

# Better TF-IDF: ngram_range(1,2) for skills like "Power BI"
vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
tfidf_matrix = vectorizer.fit_transform(df["skills"].astype(str))

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    skills = data.get("skills", "").lower()
    
    if not skills.strip():
        return jsonify({"error": "Please enter skills"}), 400

    # Calculate similarity
    user_vec = vectorizer.transform([skills])
    similarities = cosine_similarity(user_vec, tfidf_matrix).flatten()
    
    # Filter by threshold (10%) and get top 3
    top_indices = similarities.argsort()[::-1]
    results = []
    
    for i in top_indices:
        score = float(similarities[i])
        if score < 0.1: # Threshold check
            continue
        
        job = df.iloc[i].to_dict()
        job["score"] = round(score * 100, 1) # Percentage score
        results.append(job)
        if len(results) >= 3:
            break

    if not results:
        return jsonify({
            "error": "No strong matches found. Try adding more specific skills (e.g., Python, Tableau, SQL).",
            "suggestion": "You might want to ask our AI Assistant for guidance!"
        }), 404

    return jsonify(results)

@app.route("/chat", methods=["POST"])
def chat():
    if not model:
        return jsonify({"error": "AI Assistant is not configured. (Missing Gemini API Key)"}), 500
        
    data = request.get_json()
    message = data.get("message", "")
    history = data.get("history", [])

    if not message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # System prompt setup
        system_instruction = (
            "You are a friendly and professional AI Career Guide. Your goal is to help users explore career paths "
            "in a natural, conversational way. Avoid using markdown formatting like asterisks (* or **), "
            "hashes, or numbered lists. Instead, speak in clear, well-structured paragraphs as if you are "
            "mentoring the user in person. Be encouraging, specific, and provide actionable advice without "
            "using bullet points. If you mention skills or roles, weave them into your sentences naturally."
        )
        
        # Convert history for Gemini format: list of {'role': 'user'|'model', 'parts': [text]}
        gemini_history = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            gemini_history.append({"role": role, "parts": [msg["content"]]})

        # Initialize chat with history and system instruction
        chat_session = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        ).start_chat(history=gemini_history)

        response = chat_session.send_message(message)
        
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": f"AI service error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
