import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load the dataset
df = pd.read_csv('training_data.csv')

# Separate features and labels
X = df[['overall_sentiment_score', 'ticker_sentiment_score']]  # Feature columns
y = df['price_movement']  # Target label

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the Logistic Regression model
model = LogisticRegression(class_weight='balanced')

# Train the model
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
print("Model accuracy:", accuracy_score(y_test, y_pred))
print("Classification report:\n", classification_report(y_test, y_pred))

# Save the trained model to a file
joblib.dump(model, 'price_movement_model.joblib')
print("Model saved to price_movement_model.joblib")
