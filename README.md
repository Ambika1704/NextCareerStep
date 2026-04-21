# AI-Based Career Recommendation System

A intelligent career guidance platform that combines **Machine Learning** for skill-matching and **Generative AI** for personalized mentorship. This system helps users identify the best career paths based on their current skill set and provides a dedicated AI Assistant to answer detailed industry questions.

---

## Key Features

### Smart Recommendation Engine
- **TF-IDF Analysis**: Uses Natural Language Processing to analyze your skills.
- **Cosine Similarity**: Matches your profile against a curated dataset of industry roles.
- **Top 3 Predictions**: Provides the best career matches with percentage-based confidence scores.
- **Upskilling Paths**: Specifically identifies what you need to learn to land each role.

### AI Career Advisor (Powered by Gemini)
- **Natural Conversations**: Chat with a professional career consultant.
- **Context-Aware**: The assistant remembers your previous questions to provide tailored advice.
- **Actionable Guidance**: Get specific learning resources, interview tips, and salary insights.

### User Interface and Experience
- **Dark Mode Aesthetic**: A modern, sleek interface built for focus and clarity.
- **Responsive Design**: Works perfectly across all devices.
- **Micro-animations**: Smooth loading states and transitions for a premium feel.

---

## Technology Stack

- **Frontend**: HTML5, Vanilla CSS, JavaScript (ES6+)
- **Backend**: Flask (Python)
- **Machine Learning**: Scikit-learn (TF-IDF, Cosine Similarity), Pandas
- **Generative AI**: Google Gemini API (experimental/preview models)
- **Styling**: Modern CSS with CSS Variables and Flexbox/Grid

---

## Getting Started

### Prerequisites
- Python 3.8+
- A Google Gemini API Key (get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/AI-Career-Recommendation-system.git
   cd AI-Career-Recommendation-system
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the environment**:
   Create or edit the `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the application**:
   Start the Flask backend:
   ```bash
   python app.py
   ```
   *The server will run on `http://127.0.0.1:5000`*

5. **Open the Frontend**:
   Simply open `index.html` in your browser or run a local server:
   ```bash
   python -m http.server 8000
   ```
   *Access the UI at `http://127.0.0.1:8000`*

---

## Project Structure

- `app.py`: Flask backend with ML logic and AI API integration.
- `index.html`: Main frontend entry point.
- `main.js`: Frontend logic for API calls and UI updates.
- `style.css`: Premium styling and layout.
- `jobs.csv`: The dataset containing roles and required skills.

---

## Contributing
Contributions are welcome! If you have suggestions for new features or improvements, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.

---
This project is inspired by the open-source AI Career Recommendation System (https://github.com/Ravurumadhuri/AI-Career-Recommondation-system.git) and has been significantly enhanced with a custom dataset, refined recommendation logic, and an AI-powered career advisor powered by Gemini for personalized guidance.