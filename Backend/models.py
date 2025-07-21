# import os
# import tensorflow as tf
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import pickle

# # Current directory (Sentiment app)
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # Correct paths to model and tokenizer in Models/
# MODEL_PATH = os.path.join(BASE_DIR, 'Models', 'lstm_model.h5')
# TOKENIZER_PATH = os.path.join(BASE_DIR, 'Models', 'tokenizerLSTM.pkl')

# # Load the trained LSTM model once
# model = tf.keras.models.load_model(MODEL_PATH)

# # Load tokenizer used during model training
# with open(TOKENIZER_PATH, 'rb') as handle:
#     tokenizer = pickle.load(handle)

# MAX_SEQUENCE_LENGTH = 100  # Set to the max length used in training

# def predict_sentiment(text):
#     # Tokenize and pad input text
#     sequence = tokenizer.texts_to_sequences([text])
#     padded = pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, padding='post')
    
#     # Make prediction
#     prediction = model.predict(padded)
    
#     # Binary classification: >0.5 positive else negative
#     sentiment = 'positive' if prediction[0][0] > 0.5 else 'negative'
#     confidence = float(prediction[0][0])
#     return sentiment, confidence



# import os
# import tensorflow as tf
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import pickle

# Current directory (Sentiment app)
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Correct paths to model and tokenizer in Models/
# MODEL_PATH = os.path.join(BASE_DIR, 'Models', 'lstm_model.h5')
# TOKENIZER_PATH = os.path.join(BASE_DIR, 'Models', 'tokenizerLSTM.pkl')

# Load the trained LSTM model once
# model = tf.keras.models.load_model(MODEL_PATH)

# Load tokenizer used during model training
# with open(TOKENIZER_PATH, 'rb') as handle:
#     tokenizer = pickle.load(handle)

# MAX_SEQUENCE_LENGTH = 100  # Set to the max length used in training

# def predict_sentiment(text, threshold=0.5):
#     Tokenize and pad input text
#     sequence = tokenizer.texts_to_sequences([text])
#     padded = pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, padding='post')

#     Debugging prints
#     print(f"\n[DEBUG] Input text: {text}")
#     print(f"[DEBUG] Tokenized sequence: {sequence}")
#     print(f"[DEBUG] Padded sequence: {padded}")

#     Make prediction
#     prediction = model.predict(padded)
#     probability = float(prediction[0][0])

#     print(f"[DEBUG] Raw model prediction (probability): {probability}")

#     Binary classification: > threshold = positive, else negative
#     sentiment = 'positive' if probability > threshold else 'negative'

#     return sentiment, probability

# import os
# import tensorflow as tf
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import pickle
# import numpy as np

# # === Setup Paths ===
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Current file directory

# # Paths to trained model and tokenizer
# MODEL_PATH = os.path.join(BASE_DIR, 'Models', 'lstm_model.h5')
# TOKENIZER_PATH = os.path.join(BASE_DIR, 'Models', 'tokenizerLSTM.pkl')

# # Load pre-trained LSTM model
# model = tf.keras.models.load_model(MODEL_PATH)

# # Load tokenizer used during training
# with open(TOKENIZER_PATH, 'rb') as handle:
#     tokenizer = pickle.load(handle)

# # Max sequence length used during training
# MAX_SEQUENCE_LENGTH = 100

# # Function to map predicted class index to sentiment category
# def sentiment_category(score):
#     if score >= 4:
#         return "positive"
#     elif score <= 2:
#         return "negative"
#     else:
#         return "neutral"

# # === Sentiment Prediction Function ===
# def predict_sentiment(text):
#     """
#     Predict the sentiment category and confidence score of a given review text.

#     Args:
#         text (str): The input review.

#     Returns:
#         sentiment (str): Mapped sentiment category ("positive", "neutral", or "negative").
#         confidence (float): Probability score for the predicted label.
#         raw_probs (list): Probabilities for all class labels.
#     """
#     # Convert input text to sequence and pad
#     sequence = tokenizer.texts_to_sequences([text])
#     padded = pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, padding='post')

#     # Predict using the model
#     prediction = model.predict(padded)

#     # Get index of highest predicted probability
#     pred_index = np.argmax(prediction[0])

#     # Use the sentiment_category function to map it
#     sentiment = sentiment_category(pred_index)

#     # Get confidence of highest predicted class
#     confidence = float(prediction[0][pred_index])
#     raw_probs = prediction[0].tolist()

#     return sentiment, confidence, raw_probs

# # === Example Usage ===
# if __name__ == "__main__":
#     sample_text = "The delivery was late and the product is not working."
#     sentiment, confidence, probs = predict_sentiment(sample_text)

#     print(f"\nInput Text: {sample_text}")
#     print(f"Predicted Sentiment: {sentiment}")
#     print(f"Confidence: {confidence:.2f}")
#     print(f"All Class Probabilities: {probs}")



# import os
# import tensorflow as tf
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import pickle
# import numpy as np

# # === Setup Paths ===
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Current file directory

# # Paths to trained model and tokenizer
# MODEL_PATH = os.path.join(BASE_DIR, 'Models', 'lstm_model.h5')
# TOKENIZER_PATH = os.path.join(BASE_DIR, 'Models', 'tokenizerLSTM.pkl')

# # Load pre-trained LSTM model
# model = tf.keras.models.load_model(MODEL_PATH)

# # Load tokenizer used during training
# with open(TOKENIZER_PATH, 'rb') as handle:
#     tokenizer = pickle.load(handle)

# # Max sequence length used during training
# MAX_SEQUENCE_LENGTH = 100

# # Heuristic thresholds for prediction adjustments
# POS_THRESHOLD = 0.6      # Confidence threshold for positive class
# NEG_THRESHOLD = 0.6      # Confidence threshold for negative class
# NEUTRAL_GAP_MARGIN = 0.15  # If top two probabilities are close, consider it neutral

# # Function to map predicted class index to sentiment category
# def sentiment_category(probabilities):
#     pred_index = np.argmax(probabilities)
#     confidence = probabilities[pred_index]
#     sorted_probs = sorted(probabilities, reverse=True)

#     # Heuristic 1: If top two probs are close → Neutral
#     if len(sorted_probs) > 1 and abs(sorted_probs[0] - sorted_probs[1]) < NEUTRAL_GAP_MARGIN:
#         return "neutral", confidence

#     # Heuristic 2: Threshold-based classification
#     if pred_index == 2 and confidence >= POS_THRESHOLD:
#         return "positive", confidence
#     elif pred_index == 0 and confidence >= NEG_THRESHOLD:
#         return "negative", confidence
#     else:
#         return "neutral", confidence

# # === Sentiment Prediction Function ===
# def predict_sentiment(text):
#     """
#     Predict the sentiment category and confidence score of a given review text.

#     Args:
#         text (str): The input review.

#     Returns:
#         sentiment (str): Mapped sentiment category ("positive", "neutral", or "negative").
#         confidence (float): Probability score for the predicted label.
#         raw_probs (list): Probabilities for all class labels.
#     """
#     # Convert input text to sequence and pad
#     sequence = tokenizer.texts_to_sequences([text])
#     padded = pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, padding='post')

#     # Predict using the model
#     prediction = model.predict(padded)
#     raw_probs = prediction[0].tolist()

#     # Map prediction using heuristic rules
#     sentiment, confidence = sentiment_category(raw_probs)

#     return sentiment, confidence, raw_probs

# # === Example Usage ===
# if __name__ == "__main__":
#     sample_text = "The delivery was late and the product is not working."
#     sentiment, confidence, probs = predict_sentiment(sample_text)

#     print(f"\nInput Text: {sample_text}")
#     print(f"Predicted Sentiment: {sentiment}")
#     print(f"Confidence: {confidence:.2f}")
#     print(f"All Class Probabilities: {probs}")


# import os
# import tensorflow as tf
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# import pickle
# import numpy as np

# # === Setup Paths ===
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Current file directory

# # Paths to trained model and tokenizer
# MODEL_PATH = os.path.join(BASE_DIR, 'Models', 'lstm_model.h5')
# TOKENIZER_PATH = os.path.join(BASE_DIR, 'Models', 'tokenizerLSTM.pkl')

# # Load pre-trained LSTM model
# model = tf.keras.models.load_model(MODEL_PATH)

# # Load tokenizer used during training
# with open(TOKENIZER_PATH, 'rb') as handle:
#     tokenizer = pickle.load(handle)

# # Max sequence length used during training
# MAX_SEQUENCE_LENGTH = 100

# # === Updated sentiment_category function ===
# def sentiment_category(probabilities):
#     """
#     Map 5-class output probabilities to 3 sentiment categories by summing relevant classes,
#     then return the sentiment label and confidence.
#     """
#     # Sum probabilities for remapping 5 classes to 3 classes
#     negative_prob = probabilities[0] + probabilities[1]
#     neutral_prob = probabilities[2]
#     positive_prob = probabilities[3] + probabilities[4]

#     remapped_probs = [negative_prob, neutral_prob, positive_prob]

#     pred_index = np.argmax(remapped_probs)
#     confidence = remapped_probs[pred_index]

#     if pred_index == 0:
#         return "negative", confidence
#     elif pred_index == 1:
#         return "neutral", confidence
#     else:
#         return "positive", confidence

# # === Sentiment Prediction Function ===
# def predict_sentiment(text):
#     """
#     Predict the sentiment category and confidence score of a given review text.

#     Args:
#         text (str): The input review.

#     Returns:
#         sentiment (str): Mapped sentiment category ("positive", "neutral", or "negative").
#         confidence (float): Probability score for the predicted label.
#         raw_probs (list): Probabilities for all original 5 class labels.
#     """
#     # Convert input text to sequence and pad
#     sequence = tokenizer.texts_to_sequences([text])
#     padded = pad_sequences(sequence, maxlen=MAX_SEQUENCE_LENGTH, padding='post')

#     # Predict using the model
#     prediction = model.predict(padded)
#     raw_probs = prediction[0].tolist()

#     # Map prediction using remapping logic inside sentiment_category
#     sentiment, confidence = sentiment_category(raw_probs)

#     return sentiment, confidence, raw_probs



# Sentiment/models.py

# With new files
# import os
# import json
# import pickle
# import numpy as np
# from keras.models import load_model
# from django.conf import settings
# from .utils import filter_text

# # Load model & mappings only once
# BASE_DIR = os.path.join(settings.BASE_DIR, 'Sentiment', 'Models')

# model = load_model(os.path.join(BASE_DIR, 'lstm_model.h5'))

# with open(os.path.join(BASE_DIR, 'word_to_index.json')) as f:
#     word_to_index = json.load(f)

# with open(os.path.join(BASE_DIR, 'word_to_vec_map.pkl'), 'rb') as f:
#     word_to_vec_map = pickle.load(f)

# def sentence_to_indices(sentence, word_to_index, max_len=100):
#     words = sentence.split()
#     indices = np.zeros((1, max_len), dtype=int)
#     for i, word in enumerate(words[:max_len]):
#         indices[0, i] = word_to_index.get(word, 0)  # Use 0 if word not found
#     return indices

# def sentiment_category(score):
#     if score >= 4:
#         return "positive"
#     elif score <= 2:
#         return "negative"
#     else:
#         return "neutral"

# def predict_sentiment(text):
#     cleaned_text = filter_text(text)
#     input_indices = sentence_to_indices(cleaned_text, word_to_index, max_len=100)
#     prediction = model.predict(input_indices)  # e.g., [[0.05, 0.02, 0.03, 0.1, 0.8]]
#     predicted_class = int(np.argmax(prediction))
#     confidence = float(np.max(prediction))     # e.g., 0.8

#     sentiment = sentiment_category(predicted_class)
#     return sentiment, confidence


import os
import json
import pickle
import numpy as np
from keras.models import load_model
from django.conf import settings
from .utils import filter_text

# Load model & mappings only once
BASE_DIR = os.path.join(settings.BASE_DIR, 'Sentiment', 'Models')

model = load_model(os.path.join(BASE_DIR, 'lstm_model.h5'))

with open(os.path.join(BASE_DIR, 'word_to_index.json')) as f:
    word_to_index = json.load(f)

with open(os.path.join(BASE_DIR, 'word_to_vec_map.pkl'), 'rb') as f:
    word_to_vec_map = pickle.load(f)

def sentence_to_indices(sentence, word_to_index, max_len=100):
    words = sentence.split()
    indices = np.zeros((1, max_len), dtype=int)
    for i, word in enumerate(words[:max_len]):
        indices[0, i] = word_to_index.get(word, 0)  # Use 0 if word not found
    return indices

def sentiment_category(score):
    if score >= 3:
        return "positive"
    elif score <= 2:
        return "negative"
    else:
        return "neutral"

def predict_sentiment(text):
    cleaned_text = filter_text(text)
    input_indices = sentence_to_indices(cleaned_text, word_to_index, max_len=100)
    prediction = model.predict(input_indices)  # e.g., [[0.05, 0.02, 0.03, 0.1, 0.8]]
    
    predicted_class = int(np.argmax(prediction))
    confidence = float(np.max(prediction))
    
    sentiment = sentiment_category(predicted_class)
    
    # Return sentiment, confidence, and full array of class probabilities
    return sentiment, confidence, prediction[0].tolist()




