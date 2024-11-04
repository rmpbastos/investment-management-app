import requests
import pandas as pd
from dotenv import load_dotenv
import os
import time
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()
api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
ticker = "AAPL"  # Example ticker, replace with others as needed
base_url = "https://www.alphavantage.co/query"
news_data = []

# Set date range: Start 2 years back from today
end_date = datetime.now()
# start_date = end_date - timedelta(days=730)  # 2 years ago
start_date = end_date - timedelta(days=1095)  # 3 years ago

# Deduplication set to store unique timestamps
fetched_dates = set()

# Fetch news sentiment data in intervals (e.g., weekly)
def fetch_sentiment_data():
    global start_date, end_date
    
    while start_date < end_date:
        time_to = end_date.strftime('%Y%m%dT%H%M')
        time_from = (end_date - timedelta(weeks=1)).strftime('%Y%m%dT%H%M')
        
        params = {
            "function": "NEWS_SENTIMENT",
            "tickers": ticker,
            "apikey": api_key,
            "sort": "EARLIEST",
            "limit": 1000,
            "time_from": time_from,
            "time_to": time_to
        }
        
        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Extract articles and avoid duplicates
            for article in data.get("feed", []):
                timestamp = article.get("time_published")
                
                # Skip if the timestamp is already in fetched_dates
                if timestamp in fetched_dates:
                    continue
                
                fetched_dates.add(timestamp)
                
                # Extract relevant data
                news_item = {
                    "ticker": ticker,
                    "title": article.get("title"),
                    "url": article.get("url"),
                    "time_published": timestamp,
                    "overall_sentiment_score": article.get("overall_sentiment_score"),
                    "overall_sentiment_label": article.get("overall_sentiment_label"),
                    "ticker_sentiment_score": None,
                    "ticker_sentiment_label": None
                }
                
                # Extract ticker-specific sentiment
                for sentiment in article.get("ticker_sentiment", []):
                    if sentiment.get("ticker") == ticker:
                        news_item["ticker_sentiment_score"] = sentiment.get("ticker_sentiment_score")
                        news_item["ticker_sentiment_label"] = sentiment.get("ticker_sentiment_label")
                        break
                
                news_data.append(news_item)
            
            # Move the end_date one week back
            end_date -= timedelta(weeks=1)
            print(f"Fetched {len(news_data)} articles so far.")

            # Respect API call limits (e.g., pause if near the rate limit)
            # time.sleep(1)

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            break

# Run the fetch
fetch_sentiment_data()

# Create DataFrame
df = pd.DataFrame(news_data)

# Sort by time_published in descending order (newest first)
df = df.sort_values(by="time_published", ascending=False)

# Save DataFrame to csv file - option 1
df.to_csv("historical_sentiment_data_AAPL.csv", index=False)

# Save DataFrame to csv file - option 2 (This avoids duplicate headers if the script is run multiple times)
# df.to_csv("historical_sentiment_data.csv", mode="a", header=not os.path.exists("historical_sentiment_data.csv"), index=False)

print("Sentiment data saved to historical_sentiment_data.csv")
