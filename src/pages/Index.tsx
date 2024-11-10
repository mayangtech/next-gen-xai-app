import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { StockChart } from "@/components/StockChart";
import { StockPrediction } from "@/components/StockPrediction";
import { StockAnalysis } from "@/components/StockAnalysis";
import { MarketNews } from "@/components/MarketNews";
import { useStockData } from "@/hooks/useStockData";

const Index = () => {
  const [symbol, setSymbol] = useState("");
  const { toast } = useToast();
  const { data: stockData, isLoading, error, refetch } = useStockData(symbol);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive",
      });
      return;
    }
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Stock Analysis Dashboard</h1>
          
          <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="max-w-xs"
            />
            <Button type="submit" disabled={isLoading}>
              Analyze
            </Button>
          </form>

          {error && (
            <div className="text-red-500 mb-4">
              Error fetching stock data. Please try again.
            </div>
          )}

          {stockData && (
            <div className="space-y-8">
              <StockChart data={stockData.timeSeriesData} />
              <div className="grid md:grid-cols-2 gap-6">
                <StockPrediction 
                  data={stockData.timeSeriesData} 
                  symbol={stockData.metadata.symbol} 
                />
                <StockAnalysis data={stockData} />
              </div>
            </div>
          )}
          
          <MarketNews />
        </div>
      </Card>
    </div>
  );
};

export default Index;