from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import requests
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/financial-data")
async def get_financial_data(
    start_year: Optional[str] = Query(None),
    end_year: Optional[str] = Query(None),
    min_revenue: Optional[float] = Query(None),
    max_revenue: Optional[float] = Query(None),
    min_net_income: Optional[float] = Query(None),
    max_net_income: Optional[float] = Query(None),
    sort_field: Optional[str] = Query("date"),
    sort_order: Optional[str] = Query("desc")
):
    # Fetch data from FMP API
    api_key = os.getenv("FMP_API_KEY")
    url = f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={api_key}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        # Filter data
        filtered_data = []
        for item in data:
            year = datetime.strptime(item["date"], "%Y-%m-%d").year
            
            if start_year and year < int(start_year):
                continue
            if end_year and year > int(end_year):
                continue
            if min_revenue and item["revenue"] < float(min_revenue) * 1e9:
                continue
            if max_revenue and item["revenue"] > float(max_revenue) * 1e9:
                continue
            if min_net_income and item["netIncome"] < float(min_net_income) * 1e9:
                continue
            if max_net_income and item["netIncome"] > float(max_net_income) * 1e9:
                continue
                
            filtered_data.append({
                "date": item["date"],
                "revenue": item["revenue"],
                "netIncome": item["netIncome"],
                "grossProfit": item["grossProfit"],
                "eps": item["eps"],
                "operatingIncome": item["operatingIncome"]
            })
        
        # Sort data
        reverse = sort_order == "desc"
        if sort_field == "date":
            filtered_data.sort(key=lambda x: x["date"], reverse=reverse)
        else:
            filtered_data.sort(key=lambda x: x[sort_field], reverse=reverse)
            
        return filtered_data
        
    except Exception as e:
        return {"error": str(e)} 