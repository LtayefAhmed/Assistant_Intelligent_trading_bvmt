import pandas as pd
import numpy as np
from typing import Dict, Any, List

class DecisionAgent:
    def __init__(self):
        pass

    def calculate_rsi(self, series: pd.Series, period: int = 14) -> float:
        """Calculates the Relative Strength Index (RSI)."""
        delta = series.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()

        rs = gain / (loss + 1e-9)
        rsi = 100 - (100 / (1 + rs))
        return rsi.iloc[-1] if not rsi.empty else 50.0

    def calculate_macd(self, series: pd.Series) -> Dict[str, float]:
        """Calculates MACD (12, 26, 9)."""
        exp12 = series.ewm(span=12, adjust=False).mean()
        exp26 = series.ewm(span=26, adjust=False).mean()
        macd = exp12 - exp26
        signal = macd.ewm(span=9, adjust=False).mean()
        hist = macd - signal
        
        return {
            "macd": macd.iloc[-1],
            "signal": signal.iloc[-1],
            "histogram": hist.iloc[-1]
        }

    def get_optimization_suggestions(self, portfolio: Dict[str, Any], user_profile: str) -> List[str]:
        """Generates portfolio optimization suggestions based on risk profile."""
        suggestions = []
        holdings = portfolio.get("holdings", {})
        total_value = sum(h.get("quantity", 0) * h.get("avg_cost", 0) for h in holdings.values())
        cash = portfolio.get("cash", 10000.0)
        
        # 1. Cash Balance Logic
        if user_profile == "Conservative" and cash / (total_value + cash + 1) < 0.3:
            suggestions.append("Increase cash reserves to 30% for improved safety.")
        elif user_profile == "Aggressive" and cash / (total_value + cash + 1) > 0.1:
            suggestions.append("Your cash level is high for an aggressive profile. Consider reinvesting.")

        # 2. Diversification
        if len(holdings) < 3 and total_value > 0:
            suggestions.append("Your portfolio is concentrated. Add 2-3 more stocks to diversify risk.")
        
        # 3. Sector/Symbol Specific (Mocked since we don't have sectors, but can use symbol count)
        for sym, data in holdings.items():
            cost_ratio = (data["quantity"] * data["avg_cost"]) / (total_value + 1)
            if cost_ratio > 0.4:
                suggestions.append(f"High exposure to {sym} ({cost_ratio:.0%}). Consider trimming this position.")

        if not suggestions:
            suggestions.append("Your portfolio is well-balanced according to your profile.")
            
        return suggestions

    def analyze(self, symbol: str, df: pd.DataFrame, prediction_trend: str, sentiment_score: float = 0.0, user_profile: str = "Moderate") -> Dict[str, Any]:
        """
        Analyzes a stock to provide a trading recommendation.
        Factors:
        - Trend (Linear Regression)
        - RSI (Overbought/Oversold)
        - MACD (Momentum Crossover)
        - Volume Trend
        - Sentiment (Mocked News)
        - User Profile
        """
        if df.empty or len(df) < 26: # Need 26 for MACD signal
            return {
                "recommendation": "HOLD",
                "confidence": 0,
                "reasoning": ["Insufficient data for full technical analysis"],
                "indicators": {}
            }

        df = df.sort_values('Date')
        current_price = df.iloc[-1]['Close']
        
        # 1. Technical Indicators
        rsi = self.calculate_rsi(df['Close'])
        macd_data = self.calculate_macd(df['Close'])
        
        vol_sma = df['Volume'].rolling(window=20).mean().iloc[-1]
        current_vol = df.iloc[-1]['Volume']
        vol_ratio = current_vol / vol_sma if vol_sma > 0 else 1.0

        # 2. Logic Scoring
        score = 0
        reasons = []

        # RSI Logic
        if rsi < 30:
            score += 2
            reasons.append(f"RSI ({rsi:.1f}) indicates Oversold conditions.")
        elif rsi > 70:
            score -= 2
            reasons.append(f"RSI ({rsi:.1f}) indicates Overbought conditions.")

        # MACD Logic
        if macd_data["macd"] > macd_data["signal"] and macd_data["histogram"] > 0:
            score += 1.5
            reasons.append("Bullish MACD crossover detected.")
        elif macd_data["macd"] < macd_data["signal"] and macd_data["histogram"] < 0:
            score -= 1.5
            reasons.append("Bearish MACD crossover detected.")

        # Trend Logic
        if prediction_trend == "BULLISH":
            score += 3
            reasons.append("Advanced forecasting model predicts uptrend.")
        elif prediction_trend == "BEARISH":
            score -= 3
            reasons.append("Advanced forecasting model predicts downtrend.")

        # Sentiment & Volume
        if sentiment_score > 0.3:
            score += 1.5
            reasons.append("News sentiment is definitively positive.")
        elif sentiment_score < -0.3:
            score -= 1.5
            reasons.append("News sentiment is definitively negative.")

        if vol_ratio > 1.5:
            reasons.append(f"High trading volume ({vol_ratio:.1f}x avg) suggests strong move.")

        # 3. User Profile Adjustment
        threshold_buy = 2
        threshold_sell = -2
        
        if user_profile == "Conservative":
            threshold_buy = 4; threshold_sell = -1.5 
            if sentiment_score < 0: score -= 0.5
        elif user_profile == "Aggressive":
            threshold_buy = 1.2; threshold_sell = -3
            if prediction_trend == "BULLISH": score += 1

        # 4. Final Finalize
        if score >= threshold_buy + 2.5: recommendation = "STRONG BUY"
        elif score >= threshold_buy: recommendation = "BUY"
        elif score <= threshold_sell - 2.5: recommendation = "STRONG SELL"
        elif score <= threshold_sell: recommendation = "SELL"
        else: recommendation = "HOLD"

        confidence = max(5, min(98, (abs(score) / 8) * 100)) if recommendation != "HOLD" else 50

        return {
            "symbol": symbol,
            "recommendation": recommendation,
            "confidence": int(confidence),
            "reasoning": reasons,
            "indicators": {
                "rsi": round(rsi, 2),
                "macd": round(macd_data["macd"], 4),
                "macd_signal": round(macd_data["signal"], 4),
                "volume_ratio": round(vol_ratio, 2),
                "current_price": current_price,
                "sentiment_score": sentiment_score
            }
        }
