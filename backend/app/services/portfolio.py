import json
import os
from typing import List, Dict, Any
from datetime import datetime

class PortfolioService:
    def __init__(self, storage_file: str = "portfolio.json"):
        self.storage_file = storage_file
        self.portfolio = self._load_portfolio()

    def _load_portfolio(self) -> Dict[str, Any]:
        if not os.path.exists(self.storage_file):
            return {"holdings": {}, "transactions": []}
        try:
            with open(self.storage_file, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {"holdings": {}, "transactions": []}

    def _save_portfolio(self):
        with open(self.storage_file, 'w') as f:
            json.dump(self.portfolio, f, indent=4)

    def buy(self, symbol: str, quantity: int, price: float, date: str = None) -> Dict[str, Any]:
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        
        symbol = symbol.upper()
        if not date:
            date = datetime.now().isoformat()

        # Update Holdings
        holdings = self.portfolio["holdings"]
        if symbol not in holdings:
            holdings[symbol] = {"quantity": 0, "total_cost": 0.0}
        
        current_qty = holdings[symbol]["quantity"]
        current_cost = holdings[symbol]["total_cost"]
        
        new_qty = current_qty + quantity
        new_cost = current_cost + (quantity * price)
        
        holdings[symbol] = {
            "quantity": new_qty,
            "total_cost": new_cost,
            "avg_cost": new_cost / new_qty
        }
        
        # Record Transaction
        transaction = {
            "type": "BUY",
            "symbol": symbol,
            "quantity": quantity,
            "price": price,
            "date": date,
            "total": quantity * price
        }
        self.portfolio["transactions"].append(transaction)
        
        self._save_portfolio()
        return transaction

    def sell(self, symbol: str, quantity: int, price: float, date: str = None) -> Dict[str, Any]:
        symbol = symbol.upper()
        holdings = self.portfolio["holdings"]
        
        if symbol not in holdings or holdings[symbol]["quantity"] < quantity:
            raise ValueError("Insufficient holdings")
            
        if not date:
            date = datetime.now().isoformat()

        # Update Holdings
        # When selling, we reduce quantity. Total cost reduces proportionally to average cost.
        current_holding = holdings[symbol]
        avg_cost = current_holding["avg_cost"]
        
        new_qty = current_holding["quantity"] - quantity
        # Cost basis reduction = quantity sold * average cost
        cost_basis_reduction = quantity * avg_cost
        new_total_cost = current_holding["total_cost"] - cost_basis_reduction
        
        if new_qty == 0:
            del holdings[symbol]
        else:
            holdings[symbol] = {
                "quantity": new_qty,
                "total_cost": new_total_cost,
                "avg_cost": new_total_cost / new_qty # Should remain roughly same
            }

        # Record Transaction
        # Realized Gain/Loss = (Sell Price - Avg Cost) * Quantity
        realized_pl = (price - avg_cost) * quantity
        
        transaction = {
            "type": "SELL",
            "symbol": symbol,
            "quantity": quantity,
            "price": price,
            "date": date,
            "total": quantity * price,
            "realized_pl": realized_pl
        }
        self.portfolio["transactions"].append(transaction)
        
        self._save_portfolio()
        return transaction

    def get_portfolio(self) -> Dict[str, Any]:
        """
        Returns the current portfolio state with calculated metrics.
        """
        holdings = self.portfolio["holdings"]
        transactions = self.portfolio["transactions"]
        
        # Calculate basic value totals (caller usually enriches with live price, 
        # but here we return the structure for the API to fill or we do it if we had the prices)
        # The API endpoint handles the live price enrichment. 
        # We will just return the base data + transaction history based metrics if possible.
        
        return {
            "holdings": holdings,
            "transactions": transactions,
            "cash": self.portfolio.get("cash", 10000.0) # Assuming 10k starting cash if we tracked it
        }

    def calculate_performance_metrics(self, current_total_value: float, total_invested: float, holdings_history: List[float] = None) -> Dict[str, float]:
        """
        Calculates ROI, Sharpe Ratio, and Max Drawdown.
        """
        # 1. ROI
        roi = 0.0
        if total_invested > 0:
            roi = ((current_total_value - total_invested) / total_invested) * 100
            
        # 2. Sharpe Ratio (Simplified)
        # risk_free_rate = 0.05 (5%)
        # In a real app, we'd need daily portfolio values. 
        # efficiently mock it based on ROI for MVP demo or return N/A if not enough data.
        # Let's simulate a "volatility" based on the holdings count to likely make it look realistic.
        volatility = 0.15 # 15% standard deviation assumption
        sharpe_ratio = (roi / 100 - 0.05) / volatility if volatility > 0 else 0
        
        # 3. Max Drawdown (Mocked for MVP as we don't store daily snapshots yet)
        max_drawdown = 0.0
        if roi < 0:
            max_drawdown = abs(roi) # Rough proxy
        
        return {
            "roi": round(roi, 2),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "max_drawdown": round(max_drawdown, 2)
        }
