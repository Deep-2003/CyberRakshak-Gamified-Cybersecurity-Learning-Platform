import os
from pathlib import Path
from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
# from sklearn.ensemble import RandomForestClassifier
# import xgboost as xgb

import joblib
import numpy as np

# ===================== CONFIG =====================
OUTPUT_DIR = Path(__file__).parent / "classical_models"
OUTPUT_DIR.mkdir(exist_ok=True)

print("Loading datasets...")

# Load same datasets as BERT
sms = load_dataset("ucirvine/sms_spam", split="train")
enron = load_dataset("SetFit/enron_spam", split="train")

# Standardize
def prepare_data(ds):
    texts = []
    labels = []

    for example in ds:
        if "message" in example:
            text = example["message"]
        elif "text" in example:
            text = example["text"]
        else:
            text = example.get("subject", "") + " " + example.get("message", "")

        if "label" in example:
            label = int(example["label"])
        elif "spam" in example:
            label = int(example["spam"])
        else:
            label = 0

        texts.append(text)
        labels.append(label)

    return texts, labels


sms_texts, sms_labels = prepare_data(sms)
enron_texts, enron_labels = prepare_data(enron)

# Combine
all_texts = sms_texts + enron_texts
all_labels = sms_labels + enron_labels

print(f"Total samples: {len(all_texts)}")

# TF-IDF Vectorization
# print("Creating TF-IDF features...")
# vectorizer = TfidfVectorizer(
#     max_features=10000,
#     ngram_range=(1, 2),
#     stop_words="english"
# )

# X = vectorizer.fit_transform(all_texts)


# Load existing vectorizer
vectorizer = joblib.load(OUTPUT_DIR / "tfidf_vectorizer.pkl")

# Transform using existing vocabulary
X = vectorizer.transform(all_texts)
y = np.array(all_labels)
# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.15,
    random_state=42,
    stratify=y
)

print(f"Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")

# ===================== TRAIN MODELS =====================

# Random Forest (disabled)
"""
print("Training Random Forest...")
rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=50,
    n_jobs=-1,
    random_state=42,
    class_weight='balanced'
)
rf_model.fit(X_train, y_train)
"""

# XGBoost (disabled)
"""
print("Training XGBoost...")
xgb_model = xgb.XGBClassifier(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric='logloss'
)
xgb_model.fit(X_train, y_train)
"""

# Naive Bayes (active)
print("Training Naive Bayes...")
nb_model = MultinomialNB()
nb_model.fit(X_train, y_train)

# ===================== EVALUATE =====================

print("\n=== Model Evaluation ===")
print("Naive Bayes Accuracy:", nb_model.score(X_test, y_test))

# ===================== SAVE MODELS =====================

print("\nSaving models...")

joblib.dump(nb_model, OUTPUT_DIR / "naive_bayes_model.pkl")
# joblib.dump(vectorizer, OUTPUT_DIR / "tfidf_vectorizer.pkl")

print(f"✅ Model saved successfully in: {OUTPUT_DIR}")
print("Files created:")
print("   - naive_bayes_model.pkl")
# print("   - tfidf_vectorizer.pkl")