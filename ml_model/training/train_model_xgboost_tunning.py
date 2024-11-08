import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import xgboost as xgb
import joblib
from imblearn.over_sampling import SMOTE
import numpy as np

# Load the dataset
df = pd.read_csv('../data/training_data/combined_training_data.csv')

# Separate features and labels
X = df.drop(columns=['date', 'ticker', 'sector', 'price_movement'])  # Use all relevant features
y = df['price_movement']  # Target label with three classes: -1, 0, 1

# Map the labels from [-1, 0, 1] to [0, 1, 2]
y = y.map({-1: 0, 0: 1, 1: 2})

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Apply SMOTE to balance the classes in the training set
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Define the parameter grid for RandomizedSearchCV
param_dist = {
    'learning_rate': [0.01, 0.05, 0.1, 0.2],
    'max_depth': [3, 5, 7, 10],
    'n_estimators': [50, 100, 200, 300],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
    'gamma': [0, 0.1, 0.3, 0.5],
    'min_child_weight': [1, 3, 5, 7],
}

# Initialize the XGBoost model
model = xgb.XGBClassifier(objective='multi:softmax', num_class=3, eval_metric='mlogloss')

# Set up RandomizedSearchCV
random_search = RandomizedSearchCV(
    estimator=model,
    param_distributions=param_dist,
    n_iter=50,  # Number of parameter settings to try
    scoring='accuracy',
    cv=5,  # 5-fold cross-validation
    random_state=42,
    n_jobs=-1,  # Use all available CPU cores
    verbose=2
)

# Perform the hyperparameter search
print("Starting hyperparameter tuning...")
random_search.fit(X_train_resampled, y_train_resampled)

# Get the best model and parameters
best_model = random_search.best_estimator_
best_params = random_search.best_params_
print(f"Best parameters found: {best_params}")

# Predict on the test set
y_pred = best_model.predict(X_test)

# Map the predicted labels back to the original labels [-1, 0, 1]
y_pred = pd.Series(y_pred).map({0: -1, 1: 0, 2: 1})
y_test_mapped = y_test.map({0: -1, 1: 0, 2: 1})

# Print evaluation metrics
print("Model accuracy:", accuracy_score(y_test_mapped, y_pred))
print("Classification report:\n", classification_report(y_test_mapped, y_pred))
print("Confusion matrix:\n", confusion_matrix(y_test_mapped, y_pred))

# Save the best model to a file
model_filename = '../models/price_movement_model_xgboost_tuned.joblib'
joblib.dump(best_model, model_filename)
print(f"Best model saved to {model_filename}")