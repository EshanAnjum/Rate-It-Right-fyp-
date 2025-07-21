# Sentiment/utils.py
import re
import string
from nltk.corpus import stopwords
import os
import glob
import pandas as pd
from django.conf import settings
# from .models import predict_sentiment  # Still needed here

STOPWORDS = set(stopwords.words("english"))

def deEmojify(inputString):
    try:
        return inputString.encode('ascii', 'ignore').decode('ascii') 
    except:
        return inputString

def filter_text(text):
    # print("Cleaning")
    text = text.strip('\n')
    text = deEmojify(str(text))
    text_cleaned = "".join([x for x in text if x not in string.punctuation])
    text_cleaned = re.sub(' +', ' ', text_cleaned)
    text_cleaned = text_cleaned.lower()
    tokens = text_cleaned.split(" ")
    tokens = [token for token in tokens if token not in STOPWORDS]
    return ' '.join(tokens)


# Below 2 functions current in testing phase

def get_latest_csv_file(folder_path):
    list_of_files = glob.glob(os.path.join(folder_path, '*.csv'))
    if not list_of_files:
        raise FileNotFoundError("No CSV files found in folder")
    latest_file = max(list_of_files, key=os.path.getmtime)
    return latest_file



def analyze_sentiment_data(file_like):
    print("Inside analyze_sentiment_data (utils.py)")
    from .models import predict_sentiment  # 🔁 Import inside the function

    try:
        # ✅ Load CSV from file-like object
        df = pd.read_csv(file_like)
        print(f"✅ File loaded successfully from memory.")
    except Exception as e:
        print(f"❌ Failed to load CSV file from memory: {e}")
        return None

    reviews = df['review_text'].tolist()

    sentiments = []
    confidences = []

    for review in reviews:
        label, confidence, _ = predict_sentiment(review)
        sentiments.append(label)
        confidences.append(confidence)

    positive_count = sentiments.count('positive')
    total_reviews = len(sentiments)
    positive_percentage = (positive_count / total_reviews) * 100 if total_reviews > 0 else 0

    print("Total reviews", total_reviews, " | Positive %:", positive_percentage)

    return {
        'total_reviews': total_reviews,
        'positive_percentage': positive_percentage,
        'sentiments': sentiments,
        'confidences': confidences
    }


































































































# import os
# import pandas as pd
# from django.conf import settings

# def analyze_sentiment_data():
#     print("Inside analyze_sentiment_data (utils.py)")
#     from .models import predict_sentiment  # 🔁 Import inside the function

#     # Static CSV path
#     csv_path = os.path.join(settings.BASE_DIR, 'Sentiment', 'CSV', 'iphone_11_reviews_cleaned.csv')

#     try:
#         # Load CSV
#         df = pd.read_csv(csv_path)
#         print(f"✅ File loaded successfully: {csv_path}")
#     except Exception as e:
#         print(f"❌ Failed to load file: {e}")
#         return None

#     reviews = df['review_text'].tolist()

#     sentiments = []
#     confidences = []

#     for review in reviews:
#         label, confidence, _ = predict_sentiment(review)
#         sentiments.append(label)
#         confidences.append(confidence)

#     positive_count = sentiments.count('positive')
#     total_reviews = len(sentiments)
#     positive_percentage = (positive_count / total_reviews) * 100 if total_reviews > 0 else 0

#     return {
#         'total_reviews': total_reviews,
#         'positive_percentage': positive_percentage,
#         'sentiments': sentiments,
#         'confidences': confidences
#     }
