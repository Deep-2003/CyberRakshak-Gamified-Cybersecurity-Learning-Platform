from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification
)
import torch
import pandas as pd
import json

MODEL_PATH = r"models/dl/scam_detector_bert/scam_detector_bert/scam_detector_bert"

tokenizer = DistilBertTokenizerFast.from_pretrained(
    MODEL_PATH,
    local_files_only=True
)

model = DistilBertForSequenceClassification.from_pretrained(
    MODEL_PATH,
    local_files_only=True
)

df = pd.read_csv("testing/validation_dataset.csv")

results = []

for _, row in df.iterrows():

    text = row["message"]

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)

    pred = torch.argmax(outputs.logits, dim=1).item()

    results.append({
        "message": text,
        "expected": row["expected"],
        "prediction": pred
    })

with open("testing/validation_results.json", "w") as f:
    json.dump(results, f, indent=4)

print("Validation completed.")