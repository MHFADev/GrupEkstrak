import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Trash2, Users, Radio, CheckCircle, XCircle } from "lucide-react";
import type { ExtractionResponse } from "@shared/schema";

interface BatchResultsProps {
  results: ExtractionResponse[];
}

export default function BatchResults({ results }: BatchResultsProps) {
  const { toast } = useToast();

  const successfulResults = results.filter(r => r.status === 'success');
  const failedResults = results.filter(r => r.status === 'error');
  const groupResults = results.filter(r => r.urlType === 'group' && r.status === 'success');
  const channelResults = results.filter(r => r.urlType === 'channel' && r.status === 'success');

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

  const copyAllIDs = () => {
    const allIDs = successfulResults
      .map(r => r.whatsappId)
      .filter(id => id)
      .join('\n');
    
    copyToClipboard(allIDs);
    toast({
      title: "All IDs Copied!",
      description: `${successfulResults.length} WhatsApp IDs copied to clipboard`,
    });
  };

  const exportResults = () => {
    const exportData = results.map(r => ({
      url: r.originalUrl,
      rawId: r.rawId || '',
      whatsappId: r.whatsappId || '',
      type: r.urlType,
      status: r.status,
      error: r.errorMessage || ''
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `whatsapp-extraction-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Results exported as JSON file",
    });
  };

  return (
    <Card className="mt-8" data-testid="batch-results">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Batch Processing Results</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-600">
              <CheckCircle className="inline mr-1 h-4 w-4" />
              {successfulResults.length} successful
            </span>
            <span className="text-destructive">
              <XCircle className="inline mr-1 h-4 w-4" />
              {failedResults.length} failed
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Groups Found</p>
                <p className="text-2xl font-bold text-green-700" data-testid="groups-count">
                  {groupResults.length}
                </p>
              </div>
              <Users className="text-green-500 text-xl h-6 w-6" />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Channels Found</p>
                <p className="text-2xl font-bold text-blue-700" data-testid="channels-count">
                  {channelResults.length}
                </p>
              </div>
              <Radio className="text-blue-500 text-xl h-6 w-6" />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Failed URLs</p>
                <p className="text-2xl font-bold text-red-700" data-testid="failed-count">
                  {failedResults.length}
                </p>
              </div>
              <XCircle className="text-red-500 text-xl h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button 
            onClick={copyAllIDs}
            disabled={successfulResults.length === 0}
            data-testid="copy-all-ids"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy All IDs
          </Button>
          <Button 
            variant="secondary"
            onClick={exportResults}
            data-testid="export-results"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Button 
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            data-testid="clear-results"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">URL</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Raw ID</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">WhatsApp ID</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((result, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-muted/50 transition-colors"
                  data-testid={`batch-result-row-${index}`}
                >
                  <td className="py-4 pr-4">
                    <div className="text-sm text-foreground max-w-xs truncate">
                      {result.originalUrl}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge
                      variant={
                        result.status === 'success'
                          ? result.urlType === 'group'
                            ? 'default'
                            : 'secondary'
                          : 'outline'
                      }
                    >
                      {result.urlType === 'group' ? (
                        <Users className="mr-1 h-3 w-3" />
                      ) : result.urlType === 'channel' ? (
                        <Radio className="mr-1 h-3 w-3" />
                      ) : (
                        '?'
                      )}
                      {result.urlType === 'group' ? 'Group' : 
                       result.urlType === 'channel' ? 'Channel' : 
                       'Unknown'}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4">
                    {result.rawId ? (
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {result.rawId.length > 12 
                          ? `${result.rawId.substring(0, 12)}...`
                          : result.rawId
                        }
                      </code>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {result.whatsappId ? (
                      <code className="text-sm font-mono bg-accent px-2 py-1 rounded">
                        {result.whatsappId.length > 15 
                          ? `${result.whatsappId.substring(0, 15)}...`
                          : result.whatsappId
                        }
                      </code>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`text-sm ${
                      result.status === 'success' ? 'text-green-600' : 'text-destructive'
                    }`}>
                      {result.status === 'success' ? (
                        <>
                          <CheckCircle className="inline mr-1 h-3 w-3" />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle className="inline mr-1 h-3 w-3" />
                          {result.errorMessage || 'Error'}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => result.whatsappId && copyToClipboard(result.whatsappId)}
                      disabled={!result.whatsappId}
                      data-testid={`copy-id-${index}`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
