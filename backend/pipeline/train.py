import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from pymongo import MongoClient
import os
import datetime

# Import local modules
from preprocess import TelcoPreprocessor

def main():
    print("Starting ML Model Training Pipeline...")
    
    # 1. Paths configuration
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(current_dir, '..', '..'))
    
    csv_path = os.path.join(root_dir, 'Telco-Customer-Churn.csv')
    if not os.path.exists(csv_path):
        # Check alternate name mentioned in prompt
        csv_path = os.path.join(root_dir, 'WA_Fn-UseC_-Telco-Customer-Churn.csv')
        
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset CSV file not found in root path {root_dir}")
        
    print(f"Reading dataset from {csv_path}")
    raw_df = pd.read_csv(csv_path)
    
    # 2. Data Preprocessing
    preprocessor = TelcoPreprocessor()
    print("Cleaning dataset...")
    cleaned_df = preprocessor.clean_data(raw_df, is_training=True)
    
    print(f"Data cleaned. Initial shape: {raw_df.shape}, Cleaned shape (after outlier/duplicate removal): {cleaned_df.shape}")
    
    # Target column validation
    if 'Churn' not in cleaned_df.columns:
        raise ValueError("Target column 'Churn' not found in cleaned dataset.")
        
    X = cleaned_df[preprocessor.numerical_cols + preprocessor.categorical_cols]
    y = cleaned_df['Churn']
    
    # 3. Fit feature engineering transformers
    print("Fitting feature engineering transformers (StandardScaler, OneHotEncoder)...")
    preprocessor.fit(cleaned_df)
    X_trans = preprocessor.transform(cleaned_df)
    
    # 4. Split train/test sets
    X_train, X_test, y_train, y_test = train_test_split(X_trans, y, test_size=0.2, random_state=42, stratify=y)
    
    # 5. Train AI Model (RandomForest)
    print("Training RandomForestClassifier model...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # 6. Check Model Accuracy & Performance Metrics
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    # Confusion matrix breakdown
    # cm: [[TN, FP], [FN, TP]]
    tn, fp, fn, tp = cm.ravel()
    
    print(f"Performance Metrics:")
    print(f"  - Accuracy:  {accuracy:.4f}")
    print(f"  - Precision: {precision:.4f}")
    print(f"  - Recall:    {recall:.4f}")
    print(f"  - F1-Score:  {f1:.4f}")
    print(f"  - Confusion Matrix: TN={tn}, FP={fp}, FN={fn}, TP={tp}")
    
    # 7. Save model and preprocessor states
    assets_dir = os.path.abspath(os.path.join(current_dir, '..', 'app', 'assets'))
    os.makedirs(assets_dir, exist_ok=True)
    
    preprocessor_path = os.path.join(assets_dir, 'preprocessor.pkl')
    preprocessor.save(preprocessor_path)
    
    import joblib
    model_path = os.path.join(assets_dir, 'model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    # 8. Save metrics to MongoDB
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    print(f"Saving performance metrics to MongoDB at {mongo_uri}...")
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        db = client['churnradar_db']
        metrics_col = db['metrics']
        
        metrics_doc = {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "tp": int(tp),
            "fp": int(fp),
            "fn": int(fn),
            "tn": int(tn),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        
        # Clear old metrics and save new ones
        metrics_col.delete_many({})
        metrics_col.insert_one(metrics_doc)
        print("Metrics successfully saved to MongoDB.")
    except Exception as e:
        print(f"Warning: Failed to save metrics to MongoDB: {e}")
        print("Please ensure MongoDB is running to expose metrics via API.")

if __name__ == '__main__':
    main()
