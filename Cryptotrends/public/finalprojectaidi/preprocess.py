# All imports
import pandas as pd
import pandas as pd
import re
import string
import nltk
import random
from datetime import datetime, timedelta
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import warnings
warnings.filterwarnings('ignore')

def preprocess_text(text):
    text = text.strip()
    text = text.lower()
   
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s\']', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))

    words = word_tokenize(text)

    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word not in stop_words]

    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(word) for word in words]

    preprocessed_text = ' '.join(words)

    return preprocessed_text