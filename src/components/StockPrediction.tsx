import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendMessage } from "@/utils/xai-api";
import { useQuery } from "@tanstack/react-query";

interface StockPredictionProps {
  data: Array<{
    date: string;
    close: number;
  }>;
  symbol: string;
}

export const StockPrediction = ({ data, symbol }: StockPredictionProps) => {
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

  // AI-powered prediction
  const { data: aiPrediction, isLoading } = useQuery({
    queryKey: ["aiPrediction", symbol, data[0]?.close],
    queryFn: async () => {
      const prompt = `Analyze the stock ${symbol} with current price $${data[0]?.close}. Consider recent market trends and provide a short prediction for the next trading day. Format your response as: DIRECTION (UP/DOWN), PERCENTAGE, REASONING in 20 words or less.`;
      const response = await sendMessage(prompt);
      return response.choices[0].message.content;
    },
    enabled: !!symbol && !!data[0]?.close,
  });

  const prediction = calculatePrediction();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Technical Analysis</h3>
            <div className="text-2xl font-bold">
              Predicted Movement: 
              <span className={prediction.direction === "up" ? "text-green-500" : "text-red-500"}>
                {prediction.direction === "up" ? "↑" : "↓"} {prediction.percentage}%
              </span>
            </div>
            <div className="text-lg">
              Predicted Next Price: ${prediction.nextPrice}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on 20-day moving average analysis
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">AI Analysis</h3>
            {isLoading ? (
              <p className="text-gray-600">Loading AI prediction...</p>
            ) : (
              <div className="text-lg">
                {aiPrediction || "AI prediction unavailable"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};