import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Settings, HelpCircle } from "lucide-react";
import UrlInputForm from "@/components/url-input-form";
import ExtractionResults from "@/components/extraction-results";
import BatchResults from "@/components/batch-results";
import SupportedFormats from "@/components/supported-formats";
import type { ExtractionResponse } from "@shared/schema";

export default function Home() {
  const [results, setResults] = useState<ExtractionResponse[]>([]);
  const [showBatchResults, setShowBatchResults] = useState(false);

  const handleSingleResult = (result: ExtractionResponse) => {
    setResults([result]);
    setShowBatchResults(false);
  };

  const handleBatchResults = (batchResults: ExtractionResponse[]) => {
    setResults(batchResults);
    setShowBatchResults(true);
  };

  const clearResults = () => {
    setResults([]);
    setShowBatchResults(false);
  };

  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-effect">
                <MessageSquare className="text-primary-foreground text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">WhatsApp URL Extractor</h1>
                <p className="text-sm text-muted-foreground">Extract Group & Channel IDs from URLs</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
                data-testid="help-button"
              >
                <HelpCircle size={20} />
              </button>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
                data-testid="settings-button"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UrlInputForm 
          onSingleResult={handleSingleResult}
          onBatchResults={handleBatchResults}
          onClearResults={clearResults}
        />
        
        {results.length > 0 && (
          <div className="space-y-6">
            {showBatchResults ? (
              <BatchResults results={results} />
            ) : (
              <ExtractionResults results={results} />
            )}
          </div>
        )}

        <SupportedFormats />
      </main>
    </div>
  );
}
