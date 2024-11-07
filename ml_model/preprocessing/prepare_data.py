import pandas as pd

# Mock dataset with sentiment scores and labels for price movement
data = {
    'overall_sentiment_score': [0.2, 0.5, -0.3, -0.1, 0.4],
    'ticker_sentiment_score': [0.15, 0.6, -0.25, -0.15, 0.35],
    'price_movement': [1, 1, 0, 0, 1]  # 1 for price increase, 0 for decrease
}

# Create a DataFrame
df = pd.DataFrame(data)

# Save the dataset to a CSV file
df.to_csv('price_movement_data.csv', index=False)

print("Price movement dataset created and saved as price_movement_data.csv")