
import pickle
from pathlib import Path

from .training_data import training_data


# Load the trained ML model
model_path = Path(__file__).resolve().parent / "chatbot_model.pkl"

with open(model_path, "rb") as file:
    model = pickle.load(file)


# Confidence threshold for unknown questions
CONFIDENCE_THRESHOLD = 0.20


def get_chatbot_response(message):
    message = message.strip()

    if not message:
        return {
            "intent": "unknown",
            "response": "Please enter a question."
        }

    probabilities = model.predict_proba([message])[0]
    best_index = probabilities.argmax()

    predicted_intent = model.classes_[best_index]
    confidence = float(probabilities[best_index])

    # Handle questions outside the chatbot's supported topics
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "intent": "unknown",
            "response": (
                "Sorry, I can help only with questions related "
                "to Community Connect. You can ask me about help "
                "requests, volunteering, events, community sharing, "
                "or your account."
            )
        }

    # Find the predefined response for the predicted intent
    for item in training_data:
        if item["intent"] == predicted_intent:
            return {
                "intent": predicted_intent,
                "response": item["response"]
            }

    return {
        "intent": "unknown",
        "response": "Sorry, I couldn't understand your question."
    }
