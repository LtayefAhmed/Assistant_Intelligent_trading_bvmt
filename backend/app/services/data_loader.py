import pandas as pd
import os
import glob
from typing import List, Optional

class DataLoader:
    def __init__(self, data_dir: str = "c:/Assistant_Intelligent_trading_bvmt/data"):
        self.data_dir = data_dir
        self.data = pd.DataFrame()
        self._load_data()

    def _load_data(self):
        """Loads and concatenates data from both CSV and TXT files."""
        print(f"Loading data from: {self.data_dir}")
        search_path = os.path.join(self.data_dir, "histo_cotation_*.???")
        all_files = glob.glob(search_path)
        
        df_list = []
        
        for file in all_files:
            try:
                temp_df = None
                if file.endswith('.txt'):
                    # Fixed width/Space separated with specific header handling
                    # Skip the separator line (line 2)
                    temp_df = pd.read_csv(
                        file, 
                        sep='\s+', 
                        encoding='latin-1', # Common for legacy systems
                        skiprows=[1],
                        dayfirst=True,
                        on_bad_lines='skip'
                    )
                elif file.endswith('.csv'):
                    # Semicolon separated
                    temp_df = pd.read_csv(
                        file, 
                        sep=';', 
                        encoding='latin-1',
                        dayfirst=True,
                        on_bad_lines='skip'
                    )
                else:
                    continue
                
                # Normalize columns
                temp_df.columns = [c.strip() for c in temp_df.columns]
                
                # Map standardized names
                rename_map = {
                    'SEANCE': 'Date',
                    'CODE': 'Symbol',
                    'VALEUR': 'Name',
                    'OUVERTURE': 'Open',
                    'CLOTURE': 'Close',
                    'PLUS_BAS': 'Low',
                    'PLUS_HAUT': 'High',
                    'QUANTITE_NEGOCIEE': 'Volume',
                    'CAPITAUX': 'Value'
                }
                
                # Filter mostly only valid columns
                cols_to_keep = [c for c in temp_df.columns if c in rename_map]
                temp_df = temp_df[cols_to_keep].rename(columns=rename_map)
                
                # Clean data
                if 'Symbol' in temp_df.columns:
                    temp_df = temp_df.dropna(subset=['Symbol'])
                    temp_df['Symbol'] = temp_df['Symbol'].astype(str).str.strip().str.upper()
                
                df_list.append(temp_df)
                print(f"Loaded {os.path.basename(file)} with {len(temp_df)} rows")
                
            except Exception as e:
                print(f"Error loading {file}: {e}")

        if df_list:
            self.data = pd.concat(df_list, ignore_index=True)
            
            # Convert numeric columns explicitly
            numeric_cols = ['Open', 'Close', 'Low', 'High', 'Volume', 'Value']
            for col in numeric_cols:
                if col in self.data.columns:
                    # Handle comma as decimal separator if string
                    if self.data[col].dtype == object:
                         self.data[col] = self.data[col].astype(str).str.replace(',', '.', regex=False)
                    self.data[col] = pd.to_numeric(self.data[col], errors='coerce')
                    # Fill NaNs with 0 for Volume/Value, maybe forward fill for prices?
                    # For MVP, fill with 0 to avoid RuntimeWarnings in stats
                    self.data[col] = self.data[col].fillna(0)
            
            # Parse Date
            if 'Date' in self.data.columns:
                # Ensure strings are stripped of whitespace which causes parsing errors for CSVs
                if self.data['Date'].dtype == object:
                    self.data['Date'] = self.data['Date'].astype(str).str.strip()
                self.data['Date'] = pd.to_datetime(self.data['Date'], dayfirst=True, errors='coerce')
                
            self.data.dropna(subset=['Date', 'Close'], inplace=True)
            self.data.sort_values('Date', inplace=True)
            # Ensure index is unique if needed, but for now allow multiple rows per date (diff symbols)
            print(f"Total data loaded: {len(self.data)} rows")
        else:
            print("No data loaded!")

    def get_data(self) -> pd.DataFrame:
        return self.data

    def get_stock_data(self, symbol: str) -> pd.DataFrame:
        if self.data.empty:
            return pd.DataFrame()
        # Filter safely
        filtered = self.data[self.data['Symbol'] == symbol].sort_values('Date')
        return filtered

    def get_all_stocks(self) -> List[str]:
        if self.data.empty:
            return []
        
        unique_stocks = self.data['Symbol'].unique()
        # Filter out NaN or non-string
        valid_stocks = [s for s in unique_stocks if isinstance(s, str)]
        return sorted(valid_stocks)
