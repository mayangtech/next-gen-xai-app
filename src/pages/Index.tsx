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
import { LineChart } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 p-4 md:p-8">
      <Card className="mx-auto max-w-6xl shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-3 rounded-lg">
                <LineChart className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Market Analysis Pro
                </h1>
                <p className="text-muted-foreground">Real-time market insights and analysis</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="max-w-xs bg-white/50 border-accent/20"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              Analyze
            </Button>
          </form>

          {error && (
            <div className="text-destructive mb-4">
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