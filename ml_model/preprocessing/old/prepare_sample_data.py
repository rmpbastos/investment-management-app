import pandas as pd

# Sample dataset with text and a target label
data = {
    'text': [
        "Company reports record profits, stock expected to rise",
        "New product launch boosts company outlook",
        "CEO steps down amid controversy, shares fall",
        "Market downturn impacts tech sector, stock prices drop",
        "Positive earnings report exceeds expectations, stock soars"
    ],
    'label': [1, 1, 0, 0, 1]  # 1 for price increase, 0 for decrease
}

# Create a DataFrame
df = pd.DataFrame(data)

# Save the dataset to a CSV file
df.to_csv('sample_news_data.csv', index=False)

print("Sample dataset created and saved as sample_news_data.csv")
