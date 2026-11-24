
import pickle
from pathlib import Path

model_path = Path(__file__).resolve().parent / "chatbot_model.pkl"

with open(model_path, "rb") as file:
    model = pickle.load(file)

CONFIDENCE_THRESHOLD = 0.20

test_questions = [
    "I need help with food",
    "How can I register as a volunteer?",
    "What is happening to my help request?",
    "I want to donate some furniture",
    "How can I register for an event?",
    "I cannot log into my account",
    "Will it rain tomorrow?",
    "Who won the cricket match?",
    "Tell me a joke",
    "What is the capital of France?",
    "Give me a pasta recipe",
    "How far is the moon?"
]

for question in test_questions:
    probabilities = model.predict_proba([question])[0]
    best_index = probabilities.argmax()

    predicted_intent = model.classes_[best_index]
    confidence = probabilities[best_index]

    if confidence < CONFIDENCE_THRESHOLD:
        predicted_intent = "unknown"

    print("\nQuestion:", question)
    print("Predicted intent:", predicted_intent)
    print(f"Confidence: {confidence:.2%}")
    print("-" * 50)
