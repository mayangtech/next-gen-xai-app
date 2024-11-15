import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const fetchStockData = async (symbol: string) => {
  if (!symbol) return null;
  
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error("API key is missing. Please set VITE_ALPHA_VANTAGE_API_KEY in your environment variables.");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
        outputsize: "full",
      },
    });

    const data = response.data;

    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    if (data["Note"]) {
      throw new Error("API call frequency limit reached. Please try again in a minute.");
    }

    if (!data["Time Series (Daily)"]) {
      throw new Error("Invalid symbol or no data available for this stock.");
    }

    const timeSeriesData = Object.entries(data["Time Series (Daily)"]).map(
      ([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      })
    );

    return {
      metadata: {
        symbol: data["Meta Data"]["2. Symbol"],
        lastRefreshed: data["Meta Data"]["3. Last Refreshed"],
      },
      timeSeriesData: timeSeriesData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    };
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    throw new Error(error.message || "Failed to fetch stock data. Please try again.");
  }
};

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: ["stockData", symbol],
    queryFn: () => fetchStockData(symbol),
    enabled: !!symbol,
    retry: false,
  });
};