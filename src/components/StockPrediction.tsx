import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StockPredictionProps {
  data: Array<{
    date: string;
    close: number;
  }>;
}

export const StockPrediction = ({ data }: StockPredictionProps) => {
  // Simple moving average prediction
  const calculatePrediction = () => {
    const lastPrice = data[0].close;
    const ma20 = data.slice(0, 20).reduce((acc, curr) => acc + curr.close, 0) / 20;
    const predictedChange = ((ma20 - lastPrice) / lastPrice) * 100;
    
    return {
      direction: predictedChange > 0 ? "up" : "down",
      percentage: Math.abs(predictedChange).toFixed(2),
      nextPrice: (lastPrice * (1 + predictedChange / 100)).toFixed(2),
    };
  };

  const prediction = calculatePrediction();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-2xl font-bold">
            Predicted Movement: 
            <span className={prediction.direction === "up" ? "text-green-500" : "text-red-500"}>
              {prediction.direction === "up" ? "↑" : "↓"} {prediction.percentage}%
            </span>
          </div>
          <div className="text-lg">
            Predicted Next Price: ${prediction.nextPrice}
          </div>
          <p className="text-sm text-gray-500">
            Based on 20-day moving average analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
};