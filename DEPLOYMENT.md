# Deployment Instructions

## Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **Git**

## 1. Backend Setup (FastAPI)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    - **Windows**:
      ```bash
      .\venv\Scripts\activate
      ```
    - **Mac/Linux**:
      ```bash
      source venv/bin/activate
      ```

4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5.  Run the server:
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

## 2. Frontend Setup (React)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000` (or similar port shown in terminal).

## 3. Data Setup
Ensure your `data` folder is at the project root (`c:/Assistant_Intelligent_trading_bvmt/data`) and contains the `histo_cotation_YYYY.txt` or `.csv` files.

## 4. Running the Full Application
For convenience, you can verify everything is running by visiting the Dashboard at the frontend URL. The "Market Overview" should populate with data immediately.
