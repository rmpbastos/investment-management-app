import pandas as pd
import os

# List of tickers to prepare data for
tickers = ["AAPL", "MSFT", "META", "JNJ", "PFE", "AMZN", "TSLA", "PG", "KO", "BA", "CAT", "CVX", "NEE", "AMT", "T"]

# Initialize an empty DataFrame to hold all combined data
all_data = pd.DataFrame()

# Function to merge sentiment and price data for a given ticker
def prepare_data_for_ticker(ticker):
    # Define file paths for sentiment and price data
    sentiment_file = f"historical_sentiment_data_{ticker}.csv"
    price_file = f"historical_price_data_{ticker}.csv"
    
    # Check if both files exist
    if not os.path.exists(sentiment_file):
        print(f"Sentiment data file for {ticker} not found. Skipping.")
        return pd.DataFrame()
    if not os.path.exists(price_file):
        print(f"Price data file for {ticker} not found. Skipping.")
        return pd.DataFrame()
    
    # Load sentiment and price data
    sentiment_data = pd.read_csv(sentiment_file)
    price_data = pd.read_csv(price_file)
    
    # Convert date columns to datetime for merging
    sentiment_data['time_published'] = pd.to_datetime(sentiment_data['time_published']).dt.date
    price_data['date'] = pd.to_datetime(price_data['date']).dt.date
    
    # Merge on date
    combined_data = pd.merge(sentiment_data, price_data, left_on='time_published', right_on='date', how='inner')
    
    # Drop any unnecessary columns
    combined_data.drop(columns=['date'], inplace=True)
    
    print(f"Prepared data for {ticker} with {len(combined_data)} rows.")
    return combined_data

# Loop through each ticker and combine their data
for ticker in tickers:
    ticker_data = prepare_data_for_ticker(ticker)
    
    # Append the ticker’s data to the all_data DataFrame
    all_data = pd.concat([all_data, ticker_data], ignore_index=True)

# Save the combined dataset to a CSV file for model training
all_data.to_csv("combined_training_data.csv", index=False)
print("Combined training data saved to combined_training_data.csv")