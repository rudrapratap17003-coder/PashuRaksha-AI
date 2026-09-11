import pandas as pd
import joblib

from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GroupShuffleSplit
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)

DATA_FILE = Path("ml/data/ideal_calf.csv")
MODEL_FILE = Path("ml/models/pashuraksha_clinical_model.joblib")

MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(DATA_FILE, na_values=["NA", "ND", ""])

TARGET = "Clinical episode"

# Keep only explicit binary labels.
df = df[df[TARGET].isin(["Yes", "No"])].copy()
df["target"] = df[TARGET].map({"Yes": 1, "No": 0})

# ONLY information that could reasonably be observed during assessment.
FEATURES = [
    "Calf sex",
    "Weight",
    "Girth",
    "Rectal temperature",
    "Famacha score (left)",
    "Famacha score (right)",
    "Elasticity",
    "Consistency of faeces",
    "Suckling",
    "Grazing",
    "Breed",
]

FEATURES = [f for f in FEATURES if f in df.columns]

dataset = df[["CalfID"] + FEATURES + ["target"]].copy()

X = dataset[FEATURES]
y = dataset["target"]
groups = dataset["CalfID"]

numeric_features = [
    "Weight",
    "Girth",
    "Rectal temperature",
    "Famacha score (left)",
    "Famacha score (right)",
]

numeric_features = [f for f in numeric_features if f in FEATURES]

categorical_features = [
    f for f in FEATURES
    if f not in numeric_features
]

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features),
])

model = RandomForestClassifier(
    n_estimators=500,
    min_samples_split=5,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", model),
])

# Critical: animals must never appear in both train and test.
splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42,
)

train_idx, test_idx = next(
    splitter.split(X, y, groups=groups)
)

X_train = X.iloc[train_idx]
X_test = X.iloc[test_idx]

y_train = y.iloc[train_idx]
y_test = y.iloc[test_idx]

groups_train = groups.iloc[train_idx]
groups_test = groups.iloc[test_idx]

print("\n=== CLEAN PASHURAKSHA ML TRAINING ===")
print(f"Dataset rows: {len(dataset)}")
print(f"Animals: {groups.nunique()}")
print(f"Features: {len(FEATURES)}")

print("\nFeatures:")
for f in FEATURES:
    print(f"  - {f}")

print("\nTrain rows:", len(X_train))
print("Test rows:", len(X_test))
print("Train animals:", groups_train.nunique())
print("Test animals:", groups_test.nunique())
print("Animal overlap:", len(set(groups_train) & set(groups_test)))

pipeline.fit(X_train, y_train)

pred = pipeline.predict(X_test)
prob = pipeline.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, pred)
precision = precision_score(y_test, pred, zero_division=0)
recall = recall_score(y_test, pred, zero_division=0)
f1 = f1_score(y_test, pred, zero_division=0)
auc = roc_auc_score(y_test, prob)

print("\n=== PERFORMANCE ===")
print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1       : {f1:.4f}")
print(f"ROC-AUC  : {auc:.4f}")

print("\n=== CONFUSION MATRIX ===")
print(confusion_matrix(y_test, pred))

print("\n=== CLASSIFICATION REPORT ===")
print(
    classification_report(
        y_test,
        pred,
        target_names=["No clinical episode", "Clinical episode"],
        zero_division=0,
    )
)

joblib.dump(pipeline, MODEL_FILE)

print("\n=== MODEL SAVED ===")
print(MODEL_FILE)
