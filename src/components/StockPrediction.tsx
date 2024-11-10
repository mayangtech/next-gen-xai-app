import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendMessage } from "@/utils/xai-api";
import { useQuery } from "@tanstack/react-query";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

interface StockPredictionProps {
  data: Array<{
    date: string;
    close: number;
  }>;
  symbol: string;
}

export const StockPrediction = ({ data, symbol }: StockPredictionProps) => {
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

  const formatAIPrediction = (prediction: string | undefined) => {
    if (!prediction) return null;
    
    const parts = prediction.split(',').map(part => part.trim());
    if (parts.length !== 3) return null;

    const direction = parts[0].includes('UP') ? 'UP' : 'DOWN';
    const percentage = parts[1].replace('PERCENTAGE:', '').trim();
    const reasoning = parts[2].replace('REASONING:', '').trim();

    return { direction, percentage, reasoning };
  };

  const aiResult = formatAIPrediction(aiPrediction);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Technical Analysis</h3>
            <div className="text-2xl font-bold">
              Predicted Movement: 
              <span className={prediction.direction === "up" ? "text-green-500" : "text-red-500"}>
                {prediction.direction === "up" ? "↑" : "↓"} {prediction.percentage}%
              </span>
            </div>
            <div className="text-lg">
              Predicted Next Price: ${prediction.nextPrice}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Based on 20-day moving average analysis
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Analysis</h3>
            {isLoading ? (
              <p className="text-muted-foreground">Loading AI prediction...</p>
            ) : aiResult ? (
              <div className="space-y-3 bg-accent/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  {aiResult.direction === "UP" ? (
                    <TrendingUpIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDownIcon className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-semibold">Direction:</span>
                  <span className={aiResult.direction === "UP" ? "text-green-500" : "text-red-500"}>
                    {aiResult.direction}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Expected Change:</span>
                  <span>{aiResult.percentage}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold">Analysis:</span>
                  <span className="text-sm">{aiResult.reasoning}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">AI prediction unavailable</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
