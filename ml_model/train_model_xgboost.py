import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import RandomizedSearchCV

# Load the training data
data = pd.read_csv('training_data.csv')

# Prepare features and labels
X = data[['overall_sentiment_score', 'ticker_sentiment_score']]
y = data['price_movement']

# Split the data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


param_grid = {
    'n_estimators': [50, 100, 150, 200],
    'max_depth': [3, 5, 7, 10],
    'learning_rate': [0.01, 0.05, 0.1, 0.2],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
    'gamma': [0, 0.1, 0.2, 0.3],  # Regularization term
    'reg_alpha': [0, 0.01, 0.1, 1],  # L1 regularization term
    'reg_lambda': [1, 1.5, 2]  # L2 regularization term
}


# Initialize the XGBoost model
model = XGBClassifier(eval_metric='logloss')

grid_search = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=20, scoring='accuracy', cv=5, random_state=42)
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"XGBoost Model accuracy: {accuracy:.2f}")

# Print classification report
print("Classification report:")
print(classification_report(y_test, y_pred))

# Save the trained model
joblib.dump(model, 'xgboost_model.joblib')
print("XGBoost model saved as xgboost_model.joblib")
