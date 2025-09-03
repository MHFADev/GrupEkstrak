import { Card, CardContent } from "@/components/ui/card";
import { Info, Users, Radio, Lightbulb } from "lucide-react";

export default function SupportedFormats() {
  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Info className="text-primary mr-2 h-5 w-5" />
          Supported URL Formats
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group URLs */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center">
              <Users className="text-green-600 mr-2 h-4 w-4" />
              WhatsApp Groups
            </h4>
            <div className="space-y-2">
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">https://chat.whatsapp.com/[GROUP_ID]</code>
              </div>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">https://whatsapp.com/invite/[GROUP_ID]</code>
              </div>
            </div>
          </div>
          
          {/* Channel URLs */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center">
              <Radio className="text-blue-600 mr-2 h-4 w-4" />
              WhatsApp Channels
            </h4>
            <div className="space-y-2">
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">https://whatsapp.com/channel/[CHANNEL_ID]</code>
              </div>
              <div className="bg-muted rounded-md p-3">
                <code className="text-sm">https://www.whatsapp.com/channel/[CHANNEL_ID]</code>
              </div>
            </div>
          </div>
        </div>
        
        {/* Usage Tips */}
        <div className="mt-6 bg-accent rounded-md p-4">
          <h5 className="font-medium text-accent-foreground mb-2 flex items-center">
            <Lightbulb className="mr-2 h-4 w-4" />
            Usage Tips
          </h5>
          <ul className="text-sm text-accent-foreground space-y-1">
            <li>• URLs are processed in real-time as you type</li>
            <li>• Batch processing supports up to 100 URLs at once</li>
            <li>• Both HTTP and HTTPS protocols are supported</li>
            <li>• Extracted IDs can be copied individually or in bulk</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
