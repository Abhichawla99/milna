
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Switch } from "@/frontend/components/ui/switch";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Badge } from "@/frontend/components/ui/badge";
import { toast } from "@/frontend/hooks/use-toast";

interface Integration {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  isEnabled: boolean;
  config: any;
  expectedDate?: string;
  isAvailable?: boolean;
}

interface IntegrationCardProps {
  integration: Integration;
  onToggle: (id: string, enabled: boolean) => void;
  onConfigUpdate: (id: string, config: any) => void;
}

const IntegrationCard = ({ integration, onToggle, onConfigUpdate }: IntegrationCardProps) => {
  const [config, setConfig] = useState(integration.config);
  const [loading, setLoading] = useState(false);
  const Icon = integration.icon;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onConfigUpdate(integration.id, config);
      toast({
        title: "Configuration Saved",
        description: `${integration.name} configuration has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!integration.isAvailable) {
      toast({
        title: "Coming Soon! 🚀",
        description: "This feature will be available with the Pro plan. Get notified when it's ready!",
      });
      return;
    }

    try {
      await onToggle(integration.id, !integration.isEnabled);
      toast({
        title: integration.isEnabled ? "Integration Disabled" : "Integration Enabled",
        description: `${integration.name} has been ${integration.isEnabled ? 'disabled' : 'enabled'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle integration",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`mb-4 ${!integration.isAvailable ? 'opacity-75 hover:opacity-90' : ''} transition-opacity relative overflow-hidden`}>
      {!integration.isAvailable && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
            Coming Soon
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className={`text-base ${!integration.isAvailable ? 'text-muted-foreground' : ''}`}>
                {integration.name}
              </CardTitle>
              <CardDescription className="text-sm">{integration.description}</CardDescription>
              {integration.expectedDate && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Expected: {integration.expectedDate}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={integration.isEnabled ? "default" : "secondary"}>
              {integration.isEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Switch
              checked={integration.isEnabled && integration.isAvailable}
              disabled={!integration.isAvailable}
              className={!integration.isAvailable ? "opacity-50 cursor-not-allowed" : ""}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardHeader>
      
      {integration.isAvailable && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {Object.entries(integration.config).map(([key, value]) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right capitalize">
                  {key.replace(/_/g, ' ')}
                </Label>
                {key.includes('token') || key.includes('key') || key.includes('secret') ? (
                  <Input
                    type="password"
                    value={config[key] || ''}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    className="col-span-2"
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                  />
                ) : key === 'headers' ? (
                  <Textarea
                    value={config[key] || '{}'}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    className="col-span-2"
                    rows={3}
                    placeholder="Enter JSON headers"
                  />
                ) : (
                  <Input
                    value={config[key] || ''}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    className="col-span-2"
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                  />
                )}
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default IntegrationCard;
