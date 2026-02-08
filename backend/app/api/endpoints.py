from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Optional
from ..services.data_loader import DataLoader
from ..services.models import PricePredictor, AnomalyDetector
from ..services.portfolio import PortfolioService
from ..services.agent import DecisionAgent
from ..services.sentiment import SentimentService
import pandas as pd
import numpy as np

router = APIRouter()

# Initialize services (Global state for MVP)
data_loader = DataLoader() 
predictor = PricePredictor()
anomaly_detector = AnomalyDetector()
portfolio_service = PortfolioService()
decision_agent = DecisionAgent()
sentiment_service = SentimentService()

@router.get("/stocks", response_model=List[str])
async def get_stocks():
    """List all available stock symbols."""
    stocks = data_loader.get_all_stocks()
    return stocks

@router.get("/stocks/{symbol}/history", response_model=List[Dict])
async def get_stock_history(symbol: str):
    """Get historical data for a specific stock."""
    df = data_loader.get_stock_data(symbol)
    if df.empty:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    # Replace NaN with None for JSON serialization
    df = df.where(pd.notnull(df), None)
    
    # Convert dates to string for JSON
    if 'Date' in df.columns:
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
    records = df.to_dict(orient="records")
    return records

@router.get("/stocks/{symbol}/predict")
async def predict_price(symbol: str, days: int = 7):
    """Predict future price for a stock."""
    df = data_loader.get_stock_data(symbol)
    if df.empty:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    try:
        predictor.train(df)
        return predictor.predict(days=days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stocks/{symbol}/sentiment")
async def get_stock_sentiment(symbol: str):
    """Get sentiment analysis and news for a stock."""
    df = data_loader.get_stock_data(symbol)
    if df.empty:
         raise HTTPException(status_code=404, detail="Stock not found")
         
    # Contextual trend for better calc
    # Default to neutral if not enough data
    trend = "NEUTRAL"
    if len(df) > 20:
        change = df.iloc[-1]['Close'] - df.iloc[-20]['Close']
        trend = "BULLISH" if change > 0 else "BEARISH"
    
    return sentiment_service.analyze(symbol, trend)

@router.get("/agent/analyze/{symbol}")
async def analyze_stock(symbol: str, profile: str = "Moderate"):
    """Get AI Agent analysis and recommendation."""
    df = data_loader.get_stock_data(symbol)
    if df.empty:
        raise HTTPException(status_code=404, detail="Stock not found")

    predictor.train(df)
    pred_res = predictor.predict(days=7)
    prediction = pred_res["forecast"]
    metrics = pred_res["metrics"]
    
    current_avg = df.iloc[-5:]['Close'].mean() if len(df) >= 5 else df['Close'].mean()
    future_avg = np.mean([p['price'] for p in prediction]) if prediction else current_avg
    
    if not prediction or abs(future_avg - current_avg) < 1e-6:
        trend = "NEUTRAL"
    else:
        trend = "BULLISH" if future_avg > current_avg else "BEARISH"
        if abs(future_avg - current_avg) / (current_avg + 1e-9) < 0.01:
            trend = "NEUTRAL"

    sent_data = sentiment_service.analyze(symbol, trend)
    sentiment_score = sent_data.get("score", 0.0)

    analysis = decision_agent.analyze(symbol, df, trend, sentiment_score, profile)
    analysis["sentiment"] = sent_data
    analysis["forecast_metrics"] = metrics
    return analysis

@router.get("/market-mood")
async def get_market_mood():
    """Get global market mood summary."""
    stocks = ["SFBT", "BIAT", "POULINA", "TILNET", "SAH"]
    scores = []
    headlines = []
    
    for s in stocks:
        res = sentiment_service.analyze(s, "NEUTRAL")
        scores.append(res["score"])
        if res["news"]:
            headlines.append(res["news"][0])
            
    avg_score = round(float(np.mean(scores)), 2)
    label = "Neutral"
    if avg_score > 0.2: label = "Optimistic"
    elif avg_score < -0.2: label = "Pessimistic"
    
    return {
        "score": avg_score,
        "label": label,
        "representative_news": headlines[:3]
    }

@router.get("/market-summary")
async def get_market_summary():
    """Get summary metrics for the dashboard."""
    df = data_loader.get_data()
    
    if df.empty:
         return {
            "index_value": 0,
            "index_change": 0,
            "volume_value": "0",
            "volume_change": 0,
            "gainers_count": 0,
            "losers_count": 0,
            "market_trends": [],
            "recent_anomalies": []
        }

    latest_date = df['Date'].max()
    available_dates = sorted(df['Date'].unique())
    
    if len(available_dates) < 2:
        prev_date = latest_date
    else:
        prev_date = available_dates[-2]
        
    latest_data = df[df['Date'] == latest_date]
    prev_data = df[df['Date'] == prev_date]

    total_volume = latest_data['Volume'].sum() if 'Volume' in latest_data.columns else 0
    prev_total_volume = prev_data['Volume'].sum() if 'Volume' in prev_data.columns else 0
    
    volume_change = 0
    if prev_total_volume > 0:
        volume_change = ((total_volume - prev_total_volume) / prev_total_volume) * 100

    index_value = latest_data['Close'].sum() if 'Close' in latest_data.columns else 0
    prev_index_value = prev_data['Close'].sum() if 'Close' in prev_data.columns else 0
    
    index_change = 0
    if prev_index_value > 0:
        index_change = ((index_value - prev_index_value) / prev_index_value) * 100

    merged = pd.merge(latest_data[['Symbol', 'Close']], prev_data[['Symbol', 'Close']], on='Symbol', suffixes=('_curr', '_prev'))
    merged['diff'] = merged['Close_curr'] - merged['Close_prev']
    
    gainers = len(merged[merged['diff'] > 0])
    losers = len(merged[merged['diff'] < 0])
    
    trend_df = df.groupby('Date')['Volume'].sum().reset_index()
    trend_df = trend_df.sort_values('Date').tail(30)
    
    trends = []
    for _, row in trend_df.iterrows():
        trends.append({
            "name": row['Date'].strftime('%Y-%m-%d'),
            "value": int(row['Volume'])
        })

    anomalies = anomaly_detector.detect(df)
    formatted_anomalies = []
    for a in anomalies:
        formatted_anomalies.append({
            "symbol": a.get("symbol"),
            "type": a.get("reason", "Unknown"),
            "detail": a.get("details", ""),
            "severity": a.get("severity", "Medium"),
            "time": a.get("date", "N/A")
        })

    merged.sort_values('diff', ascending=False, inplace=True)
    top_gainers = merged.head(5)[['Symbol', 'diff']].to_dict(orient='records')
    top_losers = merged.tail(5)[['Symbol', 'diff']].to_dict(orient='records')

    return {
        "index_value": round(index_value, 2),
        "index_change": round(index_change, 2),
        "volume_value": f"{int(total_volume):,}",
        "volume_change": round(volume_change, 2),
        "gainers_count": gainers,
        "losers_count": losers,
        "top_gainers": top_gainers,
        "top_losers": top_losers,
        "market_trends": trends,
        "recent_anomalies": formatted_anomalies
    }

@router.get("/anomalies", response_model=List[Dict])
async def get_anomalies():
    """Return all detected anomalies."""
    df = data_loader.get_data()
    if df.empty:
        return []
    return anomaly_detector.detect(df)

@router.get("/portfolio")
async def get_portfolio():
    """Get current portfolio holdings and value."""
    data = portfolio_service.get_portfolio()
    holdings = data.get("holdings", {})
    
    enriched_holdings = []
    total_value = 0
    total_cost = 0
    
    all_prices = {}
    full_df = data_loader.get_data()
    if not full_df.empty:
         latest_date = full_df['Date'].max()
         latest_slice = full_df[full_df['Date'] == latest_date]
         for _, row in latest_slice.iterrows():
             all_prices[row['Symbol']] = row['Close']

    for symbol, h in holdings.items():
        qty = h["quantity"]
        avg = h["avg_cost"]
        current_price = all_prices.get(symbol, avg)
        
        market_value = qty * current_price
        unrealized_pl = market_value - (qty * avg)
        pl_percent = (unrealized_pl / (qty * avg) * 100) if avg > 0 else 0
        
        enriched_holdings.append({
            "symbol": symbol,
            "quantity": qty,
            "avg_cost": round(avg, 3),
            "current_price": round(current_price, 3),
            "market_value": round(market_value, 3),
            "unrealized_pl": round(unrealized_pl, 3),
            "pl_percent": round(pl_percent, 2)
        })
        
        total_value += market_value
        total_cost += (qty * avg)
    
    metrics = portfolio_service.calculate_performance_metrics(total_value, total_cost)

    return {
        "holdings": enriched_holdings,
        "total_value": round(total_value, 3),
        "total_cost": round(total_cost, 3),
        "total_pl": round(total_value - total_cost, 3),
        "roi": metrics["roi"],
        "sharpe_ratio": metrics["sharpe_ratio"],
        "max_drawdown": metrics["max_drawdown"],
        "transactions": data.get("transactions", [])
    }

@router.get("/portfolio/optimization")
async def get_portfolio_optimization(profile: str = "Moderate"):
    """Get AI suggestions for portfolio optimization."""
    data = portfolio_service.get_portfolio()
    enriched_holdings = {}
    full_df = data_loader.get_data()
    if not full_df.empty:
         latest_date = full_df['Date'].max()
         latest_slice = full_df[full_df['Date'] == latest_date]
         for _, row in latest_slice.iterrows():
             if row['Symbol'] in data["holdings"]:
                 enriched_holdings[row['Symbol']] = {
                     **data["holdings"][row['Symbol']],
                     "current_price": row['Close']
                 }
    
    portfolio_state = {
        "holdings": enriched_holdings,
        "cash": data.get("cash", 10000.0)
    }
    
    suggestions = decision_agent.get_optimization_suggestions(portfolio_state, profile)
    return {"suggestions": suggestions}

@router.post("/portfolio/transaction")
async def execute_transaction(transaction: Dict = Body(...)):
    """Execute a buy or sell transaction."""
    t_type = transaction.get("type", "").upper()
    symbol = transaction.get("symbol")
    quantity = int(transaction.get("quantity", 0))
    price = float(transaction.get("price", 0))
    
    if not symbol or quantity <= 0 or price <= 0:
        raise HTTPException(status_code=400, detail="Invalid transaction data")

    try:
        if t_type == "BUY":
            result = portfolio_service.buy(symbol, quantity, price)
        elif t_type == "SELL":
            result = portfolio_service.sell(symbol, quantity, price)
        else:
             raise HTTPException(status_code=400, detail="Invalid transaction type")
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
