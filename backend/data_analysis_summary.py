import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import os

# --- 1. Data Loading & Cleaning ---
DATA_DIR = "../data"
# Find a sample file
files = [f for f in os.listdir(DATA_DIR) if f.startswith("histo_cotation")]
if not files:
    print("No data files found for analysis.")
    exit()

df = pd.read_csv(os.path.join(DATA_DIR, files[0]), sep=';', encoding='latin-1')
df.columns = [c.strip() for c in df.columns]

# Basic cleaning to match our production pipeline
rename_map = {'SEANCE': 'Date', 'CODE': 'Symbol', 'CLOTURE': 'Close', 'QUANTITE_NEGOCIEE': 'Volume'}
df = df[rename_map.keys()].rename(columns=rename_map)
df['Close'] = pd.to_numeric(df['Close'].astype(str).str.replace(',', '.'), errors='coerce')
df['Volume'] = pd.to_numeric(df['Volume'], errors='coerce')
df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)
df.dropna(inplace=True)

print(f"--- Dataset Overview ---")
print(df.info())
print(df.describe())

# --- 2. Exploratory Data Analysis (EDA) ---
# Highlighting the most active symbols
top_symbols = df.groupby('Symbol')['Volume'].sum().sort_values(ascending=False).head(5)
print("\n--- Top 5 Symbols by Volume ---")
print(top_symbols)

# --- 3. Model Training Simulation (BIAT Symbol) ---
sample_symbol = "TN0001800457" # BIAT ISIN
symbol_data = df[df['Symbol'] == sample_symbol].sort_values('Date').tail(100)

if len(symbol_data) > 30:
    X = np.arange(len(symbol_data)).reshape(-1, 1)
    y = symbol_data['Close'].values
    
    model = LinearRegression()
    model.fit(X, y)
    preds = model.predict(X)
    
    rmse = np.sqrt(mean_squared_error(y, preds))
    print(f"\n--- Model Training Results (Symbol: {sample_symbol}) ---")
    print(f"RMSE: {rmse:.4f}")
    print(f"Trend Direction: {'UP' if model.coef_[0] > 0 else 'DOWN'}")
    
    # Simulation for a 5-day forecast
    future_X = np.arange(len(symbol_data), len(symbol_data) + 5).reshape(-1, 1)
    future_preds = model.predict(future_X)
    print(f"5-Day Forecast: {future_preds}")

# --- 4. Conclusion for Jury ---
# This script demonstrates the core logic used in our production backend.
# The production app performs this analysis dynamically for all 600+ symbols.
