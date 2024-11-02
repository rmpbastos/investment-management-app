from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load("price_movement_model.joblib")

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from request
    data = request.get_json()

    # Extract features from JSON data
    overall_sentiment = data.get("overall_sentiment_score", 0)
    ticker_sentiment = data.get("ticker_sentiment_score", 0)

    # Create feature array for prediction
    features = np.array([[overall_sentiment, ticker_sentiment]])

    # Make prediction
    prediction = model.predict(features)

    # Convert prediction to human-readable format
    result = "Increase" if prediction[0] == 1 else "Decrease"

    # Return result as JSON
    return jsonify({"prediction": result})

if __name__ == '__main__':
    app.run(port=5001)
