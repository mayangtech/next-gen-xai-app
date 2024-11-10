import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
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
};

export const useStockData = (symbol: string) => {
  return useQuery({
    queryKey: ["stockData", symbol],
    queryFn: () => fetchStockData(symbol),
    enabled: !!symbol,
  });
};