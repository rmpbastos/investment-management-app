"""
prepare_training_data.py

This script processes sentiment and historical price data for a list of stock tickers to prepare
a combined dataset for training machine learning models to predict price movements.

For each ticker:
1. Load the sentiment data and historical price data from respective CSV files in the 'historical_data' folder.
2. Process the sentiment data:
   - Convert the date format of sentiment data to align with the price data.
   - Aggregate sentiment scores by date to calculate the daily average sentiment score.
3. Process the price data:
   - Ensure the date format is consistent with sentiment data for accurate merging.
4. Merge the sentiment and price data on the date column to create a combined dataset.
5. Create a target variable ('price_movement'):
   - Calculate daily price movement by comparing adjusted closing prices.
   - Set the target as 1 if the price increased the next day, or 0 otherwise.
6. Save the prepared data to a new CSV file for each ticker in the 'training_data' folder.

Output:
For each ticker, a CSV file is saved in the 'training_data' folder, containing merged sentiment and price data,
with a target variable for daily price movement prediction.

"""
import pandas as pd
import os
import glob

# List of tickers to process
tickers = ["AAPL", "MSFT", "META", "BAC", "WFC", "C", "JNJ", "PFE", "AMZN", "TSLA", 
           "PG", "KO", "BA", "CAT", "XOM", "CVX", "NEE", "AMT", "DIS", "T"]

# Define directories for input and output
historical_data_folder = os.path.join("..", "data", "historical_data")
training_data_folder = os.path.join("..", "data", "training_data")

# Ensure the training data directory exists
os.makedirs(training_data_folder, exist_ok=True)

# Loop through each ticker and prepare the data
for ticker in tickers:
    # Define file paths for sentiment and price data
    sentiment_file = os.path.join(historical_data_folder, f"historical_sentiment_data_{ticker}.csv")
    price_file = os.path.join(historical_data_folder, f"historical_price_data_{ticker}.csv")
    
    # Check if both files exist
    if not os.path.exists(sentiment_file):
        print(f"Sentiment data file for {ticker} not found. Skipping.")
        continue
    if not os.path.exists(price_file):
        print(f"Price data file for {ticker} not found. Skipping.")
        continue
    
    # Load historical sentiment and price data
    sentiment_data = pd.read_csv(sentiment_file)
    price_data = pd.read_csv(price_file)
    
    # Extract sector information from the sentiment data
    sector = sentiment_data['sector'].iloc[0] if 'sector' in sentiment_data.columns else "Unknown"
    
    # Step 1: Process sentiment data
    sentiment_data['date'] = sentiment_data['time_published'].str[:8]
    sentiment_data['date'] = pd.to_datetime(sentiment_data['date'], format='%Y%m%d').dt.strftime('%Y-%m-%d')
    
    # Aggregate sentiment data by date with additional statistics
    daily_sentiment = sentiment_data.groupby('date').agg({
        'overall_sentiment_score': ['mean', 'min', 'max', 'std'],
        'ticker_sentiment_score': ['mean', 'min', 'max', 'std']
    }).reset_index()

    # Flatten column names after aggregation
    daily_sentiment.columns = [
        'date', 'overall_sentiment_mean', 'overall_sentiment_min', 'overall_sentiment_max', 'overall_sentiment_std',
        'ticker_sentiment_mean', 'ticker_sentiment_min', 'ticker_sentiment_max', 'ticker_sentiment_std'
    ]
    
    # Fill NaN values in standard deviation columns with 0
    daily_sentiment['overall_sentiment_std'] = daily_sentiment['overall_sentiment_std'].fillna(0)
    daily_sentiment['ticker_sentiment_std'] = daily_sentiment['ticker_sentiment_std'].fillna(0)

    # Step 2: Process price data
    price_data['date'] = pd.to_datetime(price_data['date']).dt.strftime('%Y-%m-%d')
    
    # Step 3: Merge data on the 'date' column
    training_data = pd.merge(daily_sentiment, price_data, on='date', how='inner')
    
    # Step 4: Add the sector information and ticker
    training_data['ticker'] = ticker
    training_data['sector'] = sector
    
    # Step 5: Create labels for price movement with threshold
    threshold = 0.018  # 1.8% threshold for significant price movement
    training_data['price_movement'] = training_data['adjusted_close'].pct_change().shift(-1)
    training_data['price_movement'] = training_data['price_movement'].apply(
        lambda x: 1 if x > threshold else (-1 if x < -threshold else 0)
    )
    
    # Drop rows with NaN values resulting from the diff operation
    training_data.dropna(inplace=True)
    
    # Step 6: Reorder columns
    column_order = [
        'date', 'ticker', 'sector',
        'overall_sentiment_mean', 'overall_sentiment_min', 'overall_sentiment_max', 'overall_sentiment_std',
        'ticker_sentiment_mean', 'ticker_sentiment_min', 'ticker_sentiment_max', 'ticker_sentiment_std',
        'open', 'high', 'low', 'close', 'adjusted_close', 'volume', 'dividend_amount', 'split_coefficient', 'price_movement'
    ]
    training_data = training_data[column_order]
    
    # Save the prepared data to a new CSV file for each ticker
    output_file = os.path.join(training_data_folder, f"training_data_{ticker}.csv")
    training_data.to_csv(output_file, index=False)
    print(f"Training data prepared and saved to {output_file}")

# Step 7: Concatenate all individual CSV files into one combined dataset
all_files = glob.glob(os.path.join(training_data_folder, "training_data_*.csv"))
df_list = [pd.read_csv(file) for file in all_files]
combined_df = pd.concat(df_list, ignore_index=True)

# Save the combined dataset
combined_output_file = os.path.join(training_data_folder, "combined_training_data.csv")
combined_df.to_csv(combined_output_file, index=False)
print(f"Combined dataset saved to {combined_output_file}")