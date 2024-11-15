import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { sendMessage } from "@/utils/xai-api";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export const MarketNews = () => {
  const { data: newsAnalysis, isLoading } = useQuery({
    queryKey: ["marketNews"],
    queryFn: async () => {
      const prompt = "Analyze the current stock market conditions and provide 5 key news highlights with sentiment analysis. Format: NEWS: [news] | SENTIMENT: [positive/negative/neutral] | IMPACT: [brief explanation]";
      const response = await sendMessage(prompt);
      return response.choices[0].message.content;
    },
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });

  const renderSentimentIcon = (sentiment: string | undefined) => {
    if (!sentiment) return <Minus className="text-gray-500" />;
    
    switch (sentiment.toLowerCase()) {
      case "positive":
        return <ArrowUp className="text-green-500" />;
      case "negative":
        return <ArrowDown className="text-red-500" />;
      default:
        return <Minus className="text-gray-500" />;
    }
  };

  const renderNewsItems = () => {
    if (!newsAnalysis) return null;

    return newsAnalysis.split('\n').map((item, index) => {
      if (!item.trim()) return null;

      const parts = item.split('|');
      if (parts.length !== 3) return null;

      const [newsSection, sentimentSection, impactSection] = parts;
      
      const news = newsSection?.split(':')[1]?.trim() || '';
      const sentiment = sentimentSection?.split(':')[1]?.trim().replace(/[\[\]]/g, '') || '';
      const impact = impactSection?.split(':')[1]?.trim() || '';

      if (!news) return null;

      return (
        <div key={index} className="bg-card hover:bg-accent/50 transition-colors rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              {renderSentimentIcon(sentiment)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground mb-2">{news}</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Sentiment:</span>
                  <span className={`text-sm ${
                    sentiment.toLowerCase() === "positive" ? "text-green-500" :
                    sentiment.toLowerCase() === "negative" ? "text-red-500" :
                    "text-gray-500"
                  }`}>
                    {sentiment || 'Neutral'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Impact:</span>
                  <span className="text-sm text-foreground">{impact || 'No impact analysis available'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Market News & Sentiment
          {isLoading && <span className="text-sm font-normal text-muted-foreground">Refreshing...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-4">Loading market news...</p>
        ) : (
          <div className="space-y-4">
            {renderNewsItems() || (
              <p className="text-muted-foreground text-center py-4">
                Unable to fetch market news at this time.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};