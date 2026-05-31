import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import joblib
import os

class TelcoPreprocessor:
    def __init__(self):
        # We will use StandardScaler for tenure and MonthlyCharges, and OneHotEncoder for Contract and InternetService
        self.numerical_cols = ['tenure', 'MonthlyCharges']
        self.categorical_cols = ['Contract', 'InternetService']
        self.preprocessor = None
        self.median_total_charges = None
        self.outlier_bounds = {}

    def clean_data(self, df: pd.DataFrame, is_training: bool = False) -> pd.DataFrame:
        # Create a copy
        df = df.copy()
        
        # 1. Drop customerID if it exists
        if 'customerID' in df.columns:
            df = df.drop(columns=['customerID'])

        # 2. Check 'TotalCharges' string spaces and convert to numeric
        if 'TotalCharges' in df.columns:
            # Replace empty space strings with NaN
            df['TotalCharges'] = df['TotalCharges'].replace(r'^\s*$', np.nan, regex=True)
            df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
            
            # Fill nulls with the median
            if is_training:
                self.median_total_charges = df['TotalCharges'].median()
            df['TotalCharges'] = df['TotalCharges'].fillna(self.median_total_charges if self.median_total_charges is not None else 0.0)

        # 3. Eliminate duplicate rows
        df = df.drop_duplicates()

        # 4. Map the target 'Churn' column to binary integers (Yes=1, No=0)
        if 'Churn' in df.columns:
            df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})
            # Drop any row with null Churn targets
            df = df.dropna(subset=['Churn'])

        # 5. Remove outliers for numerical columns during training
        if is_training:
            for col in self.numerical_cols:
                if col in df.columns:
                    q1 = df[col].quantile(0.25)
                    q3 = df[col].quantile(0.75)
                    iqr = q3 - q1
                    lower_bound = q1 - 1.5 * iqr
                    upper_bound = q3 + 1.5 * iqr
                    self.outlier_bounds[col] = (lower_bound, upper_bound)
                    # Filter rows within IQR bounds
                    df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]
        
        return df

    def fit(self, df: pd.DataFrame):
        # We perform fit on clean training data
        # Initialize transformers
        numeric_transformer = StandardScaler()
        categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

        self.preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, self.numerical_cols),
                ('cat', categorical_transformer, self.categorical_cols)
            ]
        )
        # Fit on selected features
        self.preprocessor.fit(df[self.numerical_cols + self.categorical_cols])

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if self.preprocessor is None:
            raise ValueError("Preprocessor not fitted yet.")
        return self.preprocessor.transform(df[self.numerical_cols + self.categorical_cols])

    def save(self, filepath: str):
        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self, filepath)
        print(f"Preprocessor saved to {filepath}")

    @classmethod
    def load(cls, filepath: str):
        return joblib.load(filepath)
