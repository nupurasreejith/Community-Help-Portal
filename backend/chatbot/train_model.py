
import pickle
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from training_data import training_data


# Prepare training sentences and labels
sentences = []
labels = []

for item in training_data:
    for pattern in item["patterns"]:
        sentences.append(pattern.lower())
        labels.append(item["intent"])


# Create the machine learning pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),
        sublinear_tf=True
    )),
    ("classifier", LogisticRegression(
    max_iter=1000,
    class_weight="balanced",
    random_state=42
    ))
])


# Train the model
model.fit(sentences, labels)


# Save the trained model
model_path = Path(__file__).resolve().parent / "chatbot_model.pkl"

with open(model_path, "wb") as file:
    pickle.dump(model, file)


print("Chatbot ML model trained successfully!")
print(f"Training examples: {len(sentences)}")
print(f"Intents: {len(set(labels))}")
print(f"Model saved at: {model_path}")
