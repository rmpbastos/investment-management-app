import pandas as pd

# Load historical sentiment and price data
sentiment_data = pd.read_csv("historical_sentiment_data_AAPL.csv")
price_data = pd.read_csv("historical_price_data_AAPL.csv")

# Step 1: Process sentiment data
# Convert sentiment date format to match price data (YYYY-MM-DD)
sentiment_data['date'] = sentiment_data['time_published'].str[:8]
sentiment_data['date'] = pd.to_datetime(sentiment_data['date'], format='%Y%m%d').dt.strftime('%Y-%m-%d')

# Aggregate sentiment data by date (average scores)
daily_sentiment = sentiment_data.groupby('date').agg({
    'overall_sentiment_score': 'mean',
    'ticker_sentiment_score': 'mean'
}).reset_index()

# Step 2: Process price data
# Ensure date format consistency
price_data['date'] = pd.to_datetime(price_data['date']).dt.strftime('%Y-%m-%d')

# Step 3: Merge data on the 'date' column
training_data = pd.merge(daily_sentiment, price_data, on='date', how='inner')

# Step 4: Create labels for price movement
# Calculate the daily price change
training_data['price_movement'] = training_data['adjusted_close'].diff().shift(-1)
training_data['price_movement'] = training_data['price_movement'].apply(lambda x: 1 if x > 0 else 0)

# Drop rows with NaN values resulting from the diff operation
training_data.dropna(inplace=True)

# Save the prepared data to a new CSV file
training_data.to_csv("training_data.csv", index=False)

print("Training data prepared and saved to training_data.csv")

