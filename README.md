# Intelligent Trading Assistant (BVMT)

An AI-powered trading assistant for the Tunis Stock Exchange (BVMT), featuring advanced analytics, sentiment processing, and personalized trading recommendations.

## key Features

### 1. Market Intelligence
- **Real-time Dashboard**: Live view of market gainers, losers, and volume trends.
- **Anomaly Detection**: Statistical engine that flags unusual price or volume spikes.
- **Sentiment Analysis**: Processes news headlines to gauge market mood (Positive/Negative/Neutral).

### 2. Decision Support Agent
- **AI Recommendations**: Generates `BUY`, `SELL`, or `HOLD` signals based on a multi-factor model (Trend + RSI + Volume + Sentiment).
- **Personalized Risk Profiles**: Tailors advice for **Conservative**, **Moderate**, or **Aggressive** investors.

### 3. Portfolio Management
- **Paper Trading**: Simulate trades with a virtual portfolio.
- **Performance Tracking**: Calculates Realized/Unrealized P&L, ROI, and Sharpe Ratio.

## Getting Started

For detailed installation and execution instructions, please refer to [DEPLOYMENT.md](DEPLOYMENT.md).

## Project Structure

- `backend/`: FastAPI application handling data ingestion, ML models, and business logic.
- `frontend/`: React + Vite application providing the interactive dashboard.
- `data/`: Historical BVMT data (CSV/TXT) used for backtesting and analysis.
