import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendMessage } from "@/utils/xai-api";
import { useQuery } from "@tanstack/react-query";

export const MarketNews = () => {
  const { data: newsAnalysis, isLoading } = useQuery({
    queryKey: ["marketNews"],
    queryFn: async () => {
      const prompt = "Analyze the current stock market conditions and provide 3 key news highlights with sentiment analysis. Format: NEWS: [news] | SENTIMENT: [positive/negative/neutral] | IMPACT: [brief explanation]";
      const response = await sendMessage(prompt);
      return response.choices[0].message.content;
    },
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Market News & Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-gray-600">Loading market news...</p>
        ) : (
          <div className="space-y-4 whitespace-pre-line">
            {newsAnalysis || "Unable to fetch market news at this time."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};