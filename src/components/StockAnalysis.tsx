import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StockAnalysisProps {
  data: {
    metadata: {
      symbol: string;
      lastRefreshed: string;
    };
    timeSeriesData: Array<{
      date: string;
      close: number;
      volume: number;
      high: number;
      low: number;
    }>;
  };
}

export const StockAnalysis = ({ data }: StockAnalysisProps) => {
  const calculateMetrics = () => {
    const prices = data.timeSeriesData.map(d => d.close);
    const volumes = data.timeSeriesData.map(d => d.volume);
    
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const volatility = Math.sqrt(
      prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / prices.length
    );

    return {
      avgPrice: avgPrice.toFixed(2),
      avgVolume: Math.round(avgVolume).toLocaleString(),
      volatility: volatility.toFixed(2),
      high52Week: Math.max(...data.timeSeriesData.map(d => d.high)).toFixed(2),
      low52Week: Math.min(...data.timeSeriesData.map(d => d.low)).toFixed(2),
    };
  };

  const metrics = calculateMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">52-Week High</p>
              <p className="text-lg font-semibold">${metrics.high52Week}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">52-Week Low</p>
              <p className="text-lg font-semibold">${metrics.low52Week}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Price</p>
              <p className="text-lg font-semibold">${metrics.avgPrice}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Volatility</p>
              <p className="text-lg font-semibold">{metrics.volatility}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Average Volume</p>
              <p className="text-lg font-semibold">{metrics.avgVolume}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};