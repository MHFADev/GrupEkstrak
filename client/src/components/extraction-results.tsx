import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle, Copy, Users, Radio, Info } from "lucide-react";
import type { ExtractionResponse } from "@shared/schema";

interface ExtractionResultsProps {
  results: ExtractionResponse[];
}

export default function ExtractionResults({ results }: ExtractionResultsProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "ID copied to clipboard successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <Card 
          key={index} 
          className={`fade-in ${result.status === 'error' ? 'border-destructive/20' : ''}`}
          data-testid={`result-${index}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                result.status === 'success' 
                  ? result.urlType === 'group' 
                    ? 'bg-green-100' 
                    : 'bg-blue-100'
                  : 'bg-red-100'
              }`}>
                {result.status === 'success' ? (
                  <CheckCircle className={`h-5 w-5 ${
                    result.urlType === 'group' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">
                    {result.status === 'success' 
                      ? `${result.urlType === 'group' ? 'Group' : 'Channel'} ID Extracted Successfully`
                      : 'Invalid URL Format'
                    }
                  </h3>
                  <Badge 
                    variant={result.status === 'success' ? 'default' : 'destructive'}
                    data-testid={`status-badge-${index}`}
                  >
                    {result.status === 'success' ? (
                      <>
                        {result.urlType === 'group' ? (
                          <Users className="mr-1 h-3 w-3" />
                        ) : (
                          <Radio className="mr-1 h-3 w-3" />
                        )}
                        {result.urlType === 'group' ? 'GROUP' : 'CHANNEL'}
                      </>
                    ) : (
                      'ERROR'
                    )}
                  </Badge>
                </div>

                {/* Original URL */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Original URL
                  </label>
                  <div className={`rounded-md p-3 break-all text-sm ${
                    result.status === 'error' 
                      ? 'bg-red-50 border border-red-200 text-red-800' 
                      : 'bg-muted'
                  }`}>
                    {result.originalUrl}
                  </div>
                </div>

                {/* Extracted ID or Error Message */}
                {result.status === 'success' && result.extractedId ? (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Extracted ID
                    </label>
                    <div className="bg-accent rounded-md p-3 flex items-center justify-between">
                      <code className="text-sm font-mono text-accent-foreground" data-testid={`extracted-id-${index}`}>
                        {result.extractedId}
                      </code>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(result.extractedId!)}
                        data-testid={`copy-button-${index}`}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  result.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-800 mb-2">
                        <Info className="inline mr-1 h-4 w-4" />
                        {result.errorMessage}
                      </p>
                      <p className="text-xs text-red-600">
                        Supported formats: chat.whatsapp.com/... or whatsapp.com/channel/...
                      </p>
                    </div>
                  )
                )}

                {/* Additional Info */}
                {result.status === 'success' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <span className="ml-2 text-foreground">
                        WhatsApp {result.urlType === 'group' ? 'Group' : 'Channel'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 text-green-600">Valid Format</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
