# import pandas as pd
# from sklearn.model_selection import train_test_split, RandomizedSearchCV
# from sklearn.metrics import accuracy_score, classification_report
# import joblib
# from xgboost import XGBClassifier

# # Load the training data
# data = pd.read_csv('combined_training_data.csv')

# # Feature Engineering: Adding more features
# data['price_volatility'] = data['high'] - data['low']  # Daily price volatility
# data['prev_close'] = data['adjusted_close'].shift(1)  # Previous day's close
# data['price_change'] = data['adjusted_close'] - data['prev_close']  # Daily price change

# # Drop any rows with NaN values created by shift operations
# data.dropna(inplace=True)

# # Prepare features and labels
# X = data[['overall_sentiment_score', 'ticker_sentiment_score', 'price_volatility', 'price_change']]
# y = data['price_movement']

# # Calculate class weights for imbalance
# class_weight_ratio = y.value_counts()[0] / y.value_counts()[1]

# # Split the data into training and testing sets (80% train, 20% test)
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Define parameter grid
# param_grid = {
#     'n_estimators': [50, 100, 150],
#     'max_depth': [3, 5, 7],
#     'learning_rate': [0.01, 0.05, 0.1],
#     'subsample': [0.6, 0.8, 1.0],
#     'colsample_bytree': [0.6, 0.8, 1.0],
#     'gamma': [0, 0.1, 0.2],
#     'reg_alpha': [0, 0.1, 1],
#     'reg_lambda': [1, 1.5, 2]
# }

# # Initialize the XGBoost model with class weighting
# model = XGBClassifier(eval_metric='logloss', scale_pos_weight=class_weight_ratio)

# # Perform Randomized Search
# grid_search = RandomizedSearchCV(estimator=model, param_distributions=param_grid, n_iter=20, scoring='accuracy', cv=5, random_state=42)
# grid_search.fit(X_train, y_train)

# # Get the best model from grid search
# best_model = grid_search.best_estimator_
# y_pred = best_model.predict(X_test)

# # Calculate accuracy
# accuracy = accuracy_score(y_test, y_pred)
# print(f"XGBoost Model accuracy: {accuracy:.2f}")

# # Print classification report
# print("Classification report:")
# print(classification_report(y_test, y_pred))

# # Save the trained model
# joblib.dump(best_model, 'xgboost_model.joblib')
# print("XGBoost model saved as xgboost_model.joblib")




# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
# import xgboost as xgb
# import joblib

# # Load the dataset
# df = pd.read_csv('../data/training_data/training_data_AAPL.csv')

# # Separate features and labels
# # Exclude columns that are not predictive features
# X = df.drop(columns=['date', 'ticker', 'sector', 'price_movement'])  # Use all relevant features
# y = df['price_movement']  # Target label with three classes (-1, 0, 1)

# # Map labels: -1 to 0, 0 to 1, 1 to 2
# y = y.map({-1: 0, 0: 1, 1: 2})

# # Split data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Initialize the XGBoost model for multi-class classification
# model = xgb.XGBClassifier(
#     objective='multi:softmax',  # Multi-class classification
#     num_class=3,  # Number of classes (0, 1, 2)
#     eval_metric='mlogloss'  # Log loss for multi-class classification
# )

# # Train the model
# model.fit(X_train, y_train)

# # Predict on the test set and map predictions back to original labels
# y_pred = model.predict(X_test)
# y_pred = pd.Series(y_pred).map({0: -1, 1: 0, 2: 1})

# # Map y_test back to the original labels for evaluation
# y_test = y_test.map({0: -1, 1: 0, 2: 1})

# # Evaluate the model
# print("Model accuracy:", accuracy_score(y_test, y_pred))
# print("Classification report:\n", classification_report(y_test, y_pred))
# print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

# # Save the trained model to a file
# model_filename = '../models/price_movement_model_xgboost_multiclass.joblib'
# joblib.dump(model, model_filename)
# print(f"Model saved to {model_filename}")




import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import xgboost as xgb
import joblib
from imblearn.over_sampling import SMOTE

# Load the dataset
df = pd.read_csv('../data/training_data/combined_training_data.csv')

# Separate features and labels
X = df.drop(columns=['date', 'ticker', 'sector', 'price_movement'])  # Use all relevant features
y = df['price_movement']  # Target label with three classes: -1, 0, 1

# Remap the class labels to non-negative integers
y = y.map({-1: 0, 0: 1, 1: 2})

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Apply SMOTE to balance the classes in the training set
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# Initialize the XGBoost model for multi-class classification
model = xgb.XGBClassifier(
    objective='multi:softmax',
    num_class=3,
    eval_metric='mlogloss'
)

# Train the model
model.fit(X_train_resampled, y_train_resampled)

# Predict on the test set
y_pred = model.predict(X_test)

# Remap predictions and true labels back to original classes
y_test = y_test.map({0: -1, 1: 0, 2: 1})
y_pred = pd.Series(y_pred).map({0: -1, 1: 0, 2: 1})

# Evaluate the model
print("Model accuracy:", accuracy_score(y_test, y_pred))
print("Classification report:\n", classification_report(y_test, y_pred))
print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

# Save the trained model to a file
model_filename = '../models/price_movement_model_xgboost_multiclass_smote.joblib'
joblib.dump(model, model_filename)
print(f"Model saved to {model_filename}")