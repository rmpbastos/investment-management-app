import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load the dataset
df = pd.read_csv('price_movement_data.csv')

# Separate features and labels
X = df[['overall_sentiment_score', 'ticker_sentiment_score']]
y = df['price_movement']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = LogisticRegression()
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print("Model accuracy:", accuracy)
print("Classification report:\n", report)


# Save the trained model
model_filename = 'price_movement_model.joblib'
joblib.dump(model, model_filename)

print(f"Model saved as {model_filename}")
