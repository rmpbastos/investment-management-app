# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import accuracy_score, classification_report
# import joblib
# from xgboost import XGBClassifier
# from sklearn.model_selection import RandomizedSearchCV

# # Load the training data
# data = pd.read_csv('combined_training_data.csv')

# # Prepare features and labels
# X = data[['overall_sentiment_score', 'ticker_sentiment_score']]
# y = data['price_movement']

# # Split the data into training and testing sets (80% train, 20% test)
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# param_grid = {
#     'n_estimators': [50, 100, 150, 200],
#     'max_depth': [3, 5, 7, 10],
#     'learning_rate': [0.01, 0.05, 0.1, 0.2],
#     'subsample': [0.6, 0.8, 1.0],
#     'colsample_bytree': [0.6, 0.8, 1.0],
#     'gamma': [0, 0.1, 0.2, 0.3],  # Regularization term
#     'reg_alpha': [0, 0.01, 0.1, 1],  # L1 regularization term
#     'reg_lambda': [1, 1.5, 2]  # L2 regularization term
# }


# # Initialize the XGBoost model
# model = XGBClassifier(eval_metric='logloss')

# grid_search = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=20, scoring='accuracy', cv=5, random_state=42)
# grid_search.fit(X_train, y_train)

# best_model = grid_search.best_estimator_
# y_pred = best_model.predict(X_test)

# # Calculate accuracy
# accuracy = accuracy_score(y_test, y_pred)
# print(f"XGBoost Model accuracy: {accuracy:.2f}")

# # Print classification report
# print("Classification report:")
# print(classification_report(y_test, y_pred))

# # Save the trained model
# joblib.dump(model, 'xgboost_model.joblib')
# print("XGBoost model saved as xgboost_model.joblib")




import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import accuracy_score, classification_report
import joblib
from xgboost import XGBClassifier

# Load the training data
data = pd.read_csv('combined_training_data.csv')

# Feature Engineering: Adding more features
data['price_volatility'] = data['high'] - data['low']  # Daily price volatility
data['prev_close'] = data['adjusted_close'].shift(1)  # Previous day's close
data['price_change'] = data['adjusted_close'] - data['prev_close']  # Daily price change

# Drop any rows with NaN values created by shift operations
data.dropna(inplace=True)

# Prepare features and labels
X = data[['overall_sentiment_score', 'ticker_sentiment_score', 'price_volatility', 'price_change']]
y = data['price_movement']

# Calculate class weights for imbalance
class_weight_ratio = y.value_counts()[0] / y.value_counts()[1]

# Split the data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define parameter grid
param_grid = {
    'n_estimators': [50, 100, 150],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.05, 0.1],
    'subsample': [0.6, 0.8, 1.0],
    'colsample_bytree': [0.6, 0.8, 1.0],
    'gamma': [0, 0.1, 0.2],
    'reg_alpha': [0, 0.1, 1],
    'reg_lambda': [1, 1.5, 2]
}

# Initialize the XGBoost model with class weighting
model = XGBClassifier(eval_metric='logloss', scale_pos_weight=class_weight_ratio)

# Perform Randomized Search
grid_search = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=20, scoring='accuracy', cv=5, random_state=42)
grid_search.fit(X_train, y_train)

# Get the best model from grid search
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"XGBoost Model accuracy: {accuracy:.2f}")

# Print classification report
print("Classification report:")
print(classification_report(y_test, y_pred))

# Save the trained model
joblib.dump(best_model, 'xgboost_model.joblib')
print("XGBoost model saved as xgboost_model.joblib")
