import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error
from typing import List, Dict, Any

class PricePredictor:
    def __init__(self):
        self.price_model = LinearRegression()
        self.volume_model = LinearRegression()
        self.is_trained = False
        self.last_date_index = 0
        self.metrics = {}

    def train(self, df: pd.DataFrame):
        """
        Trains linear regression models for both Price and Volume.
        Calculates accuracy metrics (RMSE, MAE).
        """
        if df is None or len(df) < 15:
            self.is_trained = False
            return

        df = df.sort_values('Date')
        
        # Use last 90 points if available for better trend
        train_data = df.tail(90).copy()
        train_data['DayIndex'] = np.arange(len(train_data))
        
        X = train_data[['DayIndex']]
        y_price = train_data['Close']
        y_vol = train_data['Volume']
        
        # Train Price Model
        self.price_model.fit(X, y_price)
        price_preds = self.price_model.predict(X)
        
        # Train Volume Model
        self.volume_model.fit(X, y_vol)
        vol_preds = self.volume_model.predict(X)
        
        # Calculate Metrics
        self.metrics = {
            "price": {
                "rmse": round(float(np.sqrt(mean_squared_error(y_price, price_preds))), 4),
                "mae": round(float(mean_absolute_error(y_price, price_preds)), 4)
            },
            "volume": {
                "rmse": round(float(np.sqrt(mean_squared_error(y_vol, vol_preds))), 4),
                "mae": round(float(mean_absolute_error(y_vol, vol_preds)), 4)
            }
        }
        
        self.last_date_index = len(train_data) - 1
        self.is_trained = True

    def predict(self, days: int = 7) -> Dict[str, Any]:
        if not self.is_trained:
            return {"forecast": [], "metrics": {}}
            
        future_indices = np.arange(self.last_date_index + 1, self.last_date_index + days + 1).reshape(-1, 1)
        price_predictions = self.price_model.predict(future_indices)
        vol_predictions = self.volume_model.predict(future_indices)
        
        forecast = []
        for i in range(len(price_predictions)):
            forecast.append({
                "day": int(i + 1), 
                "price": round(float(price_predictions[i]), 3),
                "volume": round(float(max(0, vol_predictions[i])), 0)
            })
            
        return {
            "forecast": forecast,
            "metrics": self.metrics
        }

class AnomalyDetector:
    def detect(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Efficiently detects anomalies using vectorized operations.
        - Calculates stats for all relevant symbols in one pass.
        - Detects Volume Spikes and Abnormal Price Jumps/Drops.
        """
        if df is None or df.empty:
            return []
            
        anomalies = []
        
        # 1. Identify latest date and symbols present
        latest_date = df['Date'].max()
        latest_data = df[df['Date'] == latest_date].copy()
        target_symbols = latest_data['Symbol'].unique()
        
        # 2. Filter historical data to relevant symbols to speed up aggregation
        hist_df = df[df['Symbol'].isin(target_symbols)].sort_values(['Symbol', 'Date'])
        
        if hist_df.empty:
            return []

        # 3. Calculate Volume Stats (Vectorized)
        vol_stats = hist_df.groupby('Symbol')['Volume'].agg(['mean', 'std']).reset_index()
        vol_stats.columns = ['Symbol', 'mean_vol', 'std_vol']
        
        # 4. Calculate Return Stats (Vectorized)
        # We need per-symbol returns first
        hist_df['Return'] = hist_df.groupby('Symbol')['Close'].pct_change()
        ret_stats = hist_df.dropna(subset=['Return']).groupby('Symbol')['Return'].agg(['mean', 'std']).reset_index()
        ret_stats.columns = ['Symbol', 'mean_ret', 'std_ret']
        
        # 5. Merge all stats back to latest_data
        merged = latest_data.merge(vol_stats, on='Symbol', how='left')
        merged = merged.merge(ret_stats, on='Symbol', how='left')
        
        # 6. Calculate Latest Return
        # We need the last return from hist_df for each symbol
        latest_returns = hist_df.groupby('Symbol').tail(1)[['Symbol', 'Return']]
        merged = merged.merge(latest_returns, on='Symbol', how='left')

        # 7. Iterate and Flag
        for _, row in merged.iterrows():
            sym = row['Symbol']
            
            # Volume Check
            if pd.notna(row['std_vol']) and row['std_vol'] > 1e-9:
                z_vol = (row['Volume'] - row['mean_vol']) / row['std_vol']
                if z_vol > 3:
                     anomalies.append({
                        "symbol": sym,
                        "date": latest_date.strftime('%Y-%m-%d'),
                        "reason": "Volume Spike",
                        "details": f"Volume {row['Volume']:,.0f} is {z_vol:.1f}x std dev above mean",
                        "severity": "High"
                    })

            # Return Check
            if pd.notna(row['std_ret']) and row['std_ret'] > 1e-9:
                z_ret = (row['Return'] - row['mean_ret']) / row['std_ret']
                if z_ret < -3:
                     anomalies.append({
                        "symbol": sym,
                        "date": latest_date.strftime('%Y-%m-%d'),
                        "reason": "Abnormal Price Drop",
                        "details": f"Return {row['Return']:.2%} is {z_ret:.1f}x std dev below mean",
                        "severity": "High"
                    })
                elif z_ret > 3:
                     anomalies.append({
                        "symbol": sym,
                        "date": latest_date.strftime('%Y-%m-%d'),
                        "reason": "Abnormal Price Jump",
                        "details": f"Return {row['Return']:.2%} is {z_ret:.1f}x std dev above mean",
                        "severity": "Medium"
                    })
                    
        return anomalies
