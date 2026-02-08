import random
from datetime import datetime, timedelta
from typing import List, Dict

class SentimentService:
    def __init__(self):
        self.news_templates = {
            "positive": [
                "{symbol} reports strong quarterly earnings, beating expectations.",
                "Analysts upgrade {symbol} to Buy following new partnership announcement.",
                "{symbol} expands into new markets, potential for high growth.",
                "Market sentiment bullish on {symbol} due to sector recovery.",
                "{symbol} announces share buyback program, boosting investor confidence."
            ],
            "negative": [
                "{symbol} misses revenue targets, citing supply chain issues.",
                "Regulatory concerns loom over {symbol}'s latest product launch.",
                "Analysts downgrade {symbol} amid rising competition.",
                "{symbol} faces lawsuit regarding patent infringement.",
                "Market sell-off impacts {symbol}, investors cautious."
            ],
            "neutral": [
                "{symbol} holds annual shareholder meeting, no major surprises.",
                "{symbol} maintains stable outlook despite market volatility.",
                "Industry report shows mixed results for {symbol}'s sector.",
                "{symbol} announces minor leadership changes.",
                "Trading volume for {symbol} remains average this week."
            ]
        }

    def analyze(self, symbol: str, price_trend: str = "NEUTRAL") -> Dict[str, any]:
        """
        Generates a simulated sentiment score and news based on the price trend.
        Range: -1.0 (Very Negative) to 1.0 (Very Positive).
        """
        
        # Base sentiment on the trend to make it consistent
        if price_trend == "BULLISH":
            base_score = random.uniform(0.2, 0.8)
            news_type = "positive" if random.random() > 0.3 else "neutral"
        elif price_trend == "BEARISH":
            base_score = random.uniform(-0.8, -0.2)
            news_type = "negative" if random.random() > 0.3 else "neutral"
        else:
            base_score = random.uniform(-0.2, 0.2)
            news_type = "neutral"

        # Add some noise
        final_score = base_score + random.uniform(-0.1, 0.1)
        final_score = max(-1.0, min(1.0, final_score)) # Clamp

        # Select news
        headline = random.choice(self.news_templates[news_type]).format(symbol=symbol)
        
        return {
            "symbol": symbol,
            "score": round(final_score, 2),
            "label": self._get_label(final_score),
            "news": [
                {
                    "title": headline,
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "source": "BVMT News (Simulated)"
                },
                {
                    "title": random.choice(self.news_templates["neutral"]).format(symbol=symbol),
                    "date": (datetime.now() - timedelta(days=random.randint(1, 5))).strftime("%Y-%m-%d"),
                    "source": "Tunisie Eco"
                }
            ]
        }

    def _get_label(self, score: float) -> str:
        if score > 0.5: return "Very Positive"
        if score > 0.1: return "Positive"
        if score < -0.5: return "Very Negative"
        if score < -0.1: return "Negative"
        return "Neutral"
