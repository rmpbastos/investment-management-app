# from flask import Flask, request, jsonify
# import joblib
# import numpy as np

# app = Flask(__name__)

# # Load the trained model
# model = joblib.load("price_movement_model.joblib")

# @app.route('/predict', methods=['POST'])
# def predict():
#     # Get JSON data from request
#     data = request.get_json()

#     # Extract features from JSON data
#     overall_sentiment = data.get("overall_sentiment_score", 0)
#     ticker_sentiment = data.get("ticker_sentiment_score", 0)

#     # Create feature array for prediction
#     features = np.array([[overall_sentiment, ticker_sentiment]])

#     # Make prediction
#     prediction = model.predict(features)

#     # Convert prediction to human-readable format
#     result = "Increase" if prediction[0] == 1 else "Decrease"

#     # Return result as JSON
#     return jsonify({"prediction": result})

# if __name__ == '__main__':
#     app.run(port=5001)




# from flask import Flask, request, jsonify
# import joblib
# import numpy as np

# app = Flask(__name__)

# # Load the trained model
# model_path = "./models/price_movement_model_xgboost_with_all_features.joblib"
# print(f"Loading model from: {model_path}")
# model = joblib.load(model_path)

# # Define the feature names (make sure they match the training data)
# FEATURE_NAMES = [
#     "overall_sentiment_mean", "overall_sentiment_min", "overall_sentiment_max", "overall_sentiment_std",
#     "ticker_sentiment_mean", "ticker_sentiment_min", "ticker_sentiment_max", "ticker_sentiment_std",
#     "open", "high", "low", "close", "adjusted_close", "volume", "dividend_amount", "split_coefficient",
#     "RSI", "MACD", "Signal_Line", "MACD_Histogram",
#     "Upper_Band", "Lower_Band", "Band_Width", "ATR",
#     "ticker_encoded", "sector_encoded"
# ]

# # Define a default feature vector (26 features)
# default_features = np.zeros(len(FEATURE_NAMES))

# # Define the /predict route
# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         # Get JSON data from request
#         data = request.get_json()

#         # Update the default feature vector with input values
#         default_features[0] = data.get("overall_sentiment_score", 0)
#         default_features[4] = data.get("ticker_sentiment_score", 0)

#         # Convert the feature vector to a 2D array for prediction
#         features_array = np.array([default_features])

#         # Make prediction
#         prediction = model.predict(features_array)

#         # Map prediction to human-readable format
#         prediction_map = {0: "Decrease", 1: "No Movement", 2: "Increase"}
#         result = prediction_map.get(prediction[0], "Unknown")

#         # Return result as JSON
#         return jsonify({"prediction": result})

#     except Exception as e:
#         print("Error during prediction:", str(e))
#         return jsonify({"error": "Prediction failed", "message": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5001)

from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained XGBoost model
model_path = "./models/price_movement_model_xgboost_with_all_features.joblib"
print(f"Loading model from: {model_path}")
model = joblib.load(model_path)

# Define the expected feature names (in the same order as used during training)
FEATURE_NAMES = [
    "overall_sentiment_mean", "overall_sentiment_min", "overall_sentiment_max", "overall_sentiment_std",
    "ticker_sentiment_mean", "ticker_sentiment_min", "ticker_sentiment_max", "ticker_sentiment_std",
    "open", "high", "low", "close", "adjusted_close", "volume", "dividend_amount", "split_coefficient",
    "RSI", "MACD", "Signal_Line", "MACD_Histogram",
    "Upper_Band", "Lower_Band", "Band_Width", "ATR",
    "ticker_encoded", "sector_encoded"
]

# Initialize a default feature vector (26 features set to 0)
default_features = np.zeros(len(FEATURE_NAMES))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Update the default feature vector with input values
        for i, feature_name in enumerate(FEATURE_NAMES):
            if feature_name in data:
                default_features[i] = data[feature_name]

        # Reshape the feature vector for prediction (1 sample, 26 features)
        features_array = np.array([default_features])

        # Make the prediction
        prediction = model.predict(features_array)

        # Map prediction to human-readable format
        prediction_map = {0: "Decrease", 1: "No Movement", 2: "Increase"}
        result = prediction_map.get(prediction[0], "Unknown")

        # Return the prediction result as JSON
        return jsonify({"prediction": result})

    except Exception as e:
        print("Error during prediction:", str(e))
        return jsonify({"error": "Prediction failed", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
