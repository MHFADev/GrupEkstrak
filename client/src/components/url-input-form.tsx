import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Search, X, Plus, Layers, Loader2, CheckCircle, XCircle } from "lucide-react";
import { whatsappUrlSchema, batchUrlSchema, type WhatsappUrlInput, type BatchUrlInput, type ExtractionResponse } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { extractWhatsAppId, isValidWhatsAppUrl, parseMultipleUrls } from "@/lib/whatsapp-extractor";

interface UrlInputFormProps {
  onSingleResult: (result: ExtractionResponse) => void;
  onBatchResults: (results: ExtractionResponse[]) => void;
  onClearResults: () => void;
}

export default function UrlInputForm({ onSingleResult, onBatchResults, onClearResults }: UrlInputFormProps) {
  const [showBatchMode, setShowBatchMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const { toast } = useToast();

  const singleForm = useForm<WhatsappUrlInput>({
    resolver: zodResolver(whatsappUrlSchema),
    defaultValues: {
      url: ""
    }
  });

  const batchForm = useForm<BatchUrlInput>({
    resolver: zodResolver(batchUrlSchema),
    defaultValues: {
      urls: []
    }
  });

  const singleMutation = useMutation({
    mutationFn: async (data: WhatsappUrlInput) => {
      // Process locally for faster response
      return extractWhatsAppId(data.url);
    },
    onSuccess: (result) => {
      onSingleResult(result);
      if (result.status === 'success') {
        toast({
          title: "Success",
          description: `${result.urlType === 'group' ? 'Group' : 'Channel'} ID extracted successfully!`,
        });
      } else {
        toast({
          title: "Error",
          description: result.errorMessage || "Failed to extract ID",
          variant: "destructive",
        });
      }
    }
  });

  const batchMutation = useMutation({
    mutationFn: async (data: BatchUrlInput) => {
      // Process locally for faster response
      return data.urls.map(url => extractWhatsAppId(url));
    },
    onSuccess: (results) => {
      onBatchResults(results);
      const successful = results.filter(r => r.status === 'success').length;
      toast({
        title: "Batch Processing Complete",
        description: `Successfully extracted ${successful} out of ${results.length} IDs`,
      });
    }
  });

  const handleUrlInputChange = (value: string) => {
    setUrlInput(value);
    singleForm.setValue('url', value);
    
    if (value.trim()) {
      setIsValidUrl(isValidWhatsAppUrl(value));
    } else {
      setIsValidUrl(null);
    }
  };

  const handleBatchInputChange = (value: string) => {
    setBatchInput(value);
    const urls = parseMultipleUrls(value);
    batchForm.setValue('urls', urls);
  };

  const clearInput = () => {
    setUrlInput("");
    singleForm.reset();
    setIsValidUrl(null);
    onClearResults();
  };

  const toggleBatchMode = () => {
    setShowBatchMode(!showBatchMode);
    if (!showBatchMode) {
      setBatchInput("");
      batchForm.reset();
    }
  };

  const onSingleSubmit = (data: WhatsappUrlInput) => {
    singleMutation.mutate(data);
  };

  const onBatchSubmit = (data: BatchUrlInput) => {
    batchMutation.mutate(data);
  };

  const detectedUrls = parseMultipleUrls(batchInput);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Extract WhatsApp IDs</h2>
          <p className="text-muted-foreground text-sm">
            Paste WhatsApp group or channel URLs below to extract their unique IDs
          </p>
        </div>

        {/* Single URL Input */}
        <Form {...singleForm}>
          <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4 mb-6">
            <FormField
              control={singleForm.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        value={urlInput}
                        onChange={(e) => {
                          handleUrlInputChange(e.target.value);
                          field.onChange(e);
                        }}
                        placeholder="https://chat.whatsapp.com/..."
                        className="pr-12"
                        data-testid="url-input"
                      />
                      <button
                        type="button"
                        onClick={clearInput}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        data-testid="clear-input"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </FormControl>
                  <div className="flex items-center space-x-1 text-sm">
                    {isValidUrl === true && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Valid WhatsApp URL</span>
                      </>
                    )}
                    {isValidUrl === false && (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">Invalid WhatsApp URL format</span>
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={singleMutation.isPending || !isValidUrl}
              className="w-full sm:w-auto"
              data-testid="extract-single-button"
            >
              {singleMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Extract ID
            </Button>
          </form>
        </Form>

        {/* Batch Processing Section */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Batch Processing</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBatchMode}
              data-testid="toggle-batch-mode"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Multiple URLs
            </Button>
          </div>

          {showBatchMode && (
            <Form {...batchForm}>
              <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-3">
                <FormField
                  control={batchForm.control}
                  name="urls"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          value={batchInput}
                          onChange={(e) => handleBatchInputChange(e.target.value)}
                          rows={6}
                          placeholder={`Paste multiple URLs here (one per line)\nhttps://chat.whatsapp.com/...\nhttps://whatsapp.com/channel/...`}
                          className="resize-none"
                          data-testid="batch-url-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground" data-testid="url-count">
                    {detectedUrls.length} URLs detected
                  </span>
                  <Button
                    type="submit"
                    disabled={batchMutation.isPending || detectedUrls.length === 0}
                    data-testid="extract-batch-button"
                  >
                    {batchMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Layers className="mr-2 h-4 w-4" />
                    )}
                    Extract All IDs
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
