
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import { Progress } from "@/frontend/components/ui/progress";
import { toast } from "@/frontend/hooks/use-toast";
import { 
  CreditCard, 
  Crown,
  MessageSquare,
  Calendar,
  Gift,
  AlertTriangle,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Users,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useSubscription } from "@/frontend/hooks/useSubscription";
import { PricingWidget } from "@/frontend/components/upgrade/PricingWidget";

const BillingSection = () => {
  const {
    subscribed,
    subscriptionTier,
    subscriptionEnd,
    messageCount,
    messageLimit,
    messagesRemaining,
    isLimitReached,
    appsumoAccess,
    loading,
    isProUser,
    proUserData,
    userLimits,
    agentCount,
    integrationCount,
    documentCount,
    createCheckout,
    openCustomerPortal,
    redeemAppsumoCode,
    refreshUsage,
    checkMessageLimit,
    downgradeFromPro,
    canCreateAgent,
    canSendMessage,
    canAddIntegration,
    canUploadDocument,
  } = useSubscription();
  
  const [appsumoCode, setAppsumoCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);



  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer portal",
        variant: "destructive",
      });
    }
  };

  const handleRedeemCode = async () => {
    if (!appsumoCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter an AppSumo code",
        variant: "destructive",
      });
      return;
    }

    setRedeeming(true);
    try {
      const result = await redeemAppsumoCode(appsumoCode.trim());
      
      if (result.success) {
        toast({
          title: "Success! 🎉",
          description: result.message,
        });
        setAppsumoCode('');
        await checkMessageLimit(); // Refresh message limit after redemption
      } else {
        toast({
          title: "Redemption Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem code",
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };



  const handleDowngrade = async () => {
    try {
      const success = await downgradeFromPro();
      if (success) {
        toast({
          title: "Downgraded",
          description: "You've been downgraded to Free plan",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to downgrade",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to downgrade",
        variant: "destructive",
      });
    }
  };

  const hasProAccess = isProUser || subscribed || appsumoAccess;
  const usagePercentage = hasProAccess ? 0 : (messageCount / messageLimit) * 100;

  const getLimitDisplay = (current: number, limit: number, unlimited: boolean) => {
    if (unlimited) return `${current} / ∞`;
    return `${current} / ${limit}`;
  };

  const getLimitColor = (current: number, limit: number, unlimited: boolean) => {
    if (unlimited) return 'text-green-600';
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your subscription status and usage information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">
                {hasProAccess ? "Pro Plan" : "Free Plan"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {hasProAccess 
                  ? appsumoAccess 
                    ? "AppSumo Lifetime Access" 
                    : proUserData?.subscription_type === 'enterprise'
                      ? "Enterprise Plan"
                      : subscriptionEnd 
                        ? `Renews ${new Date(subscriptionEnd).toLocaleDateString()}`
                        : "Active subscription"
                  : `Limited to ${messageLimit} messages per month`
                }
              </p>
            </div>
            <Badge variant={hasProAccess ? "default" : "secondary"}>
              {hasProAccess ? "Pro" : "Free"}
            </Badge>
          </div>

          {/* Pro User Features Display */}
          {isProUser && proUserData && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Pro Features Active</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Unlimited Messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Up to 7 Agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Custom Integrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>API Access</span>
                </div>
              </div>
            </div>
          )}

          {/* Usage Limits */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Usage Limits</h4>
            
            {/* Messages */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Messages</span>
              </div>
              <span className={`text-sm font-medium ${getLimitColor(messageCount, messageLimit, hasProAccess)}`}>
                {getLimitDisplay(messageCount, messageLimit, hasProAccess)}
              </span>
            </div>

            {/* Agents */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Agents</span>
              </div>
              <span className={`text-sm font-medium ${getLimitColor(agentCount, userLimits?.agent_limit || 3, false)}`}>
                {userLimits?.agent_limit === 7 ? `${agentCount} / 7` : getLimitDisplay(agentCount, userLimits?.agent_limit || 3, false)}
              </span>
            </div>

            {/* Integrations */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Integrations</span>
              </div>
              <span className={`text-sm font-medium ${getLimitColor(integrationCount, userLimits?.integration_limit || 2, hasProAccess)}`}>
                {getLimitDisplay(integrationCount, userLimits?.integration_limit || 2, hasProAccess)}
              </span>
            </div>

            {/* Documents */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Documents</span>
              </div>
              <span className={`text-sm font-medium ${getLimitColor(documentCount, userLimits?.document_limit || 5, hasProAccess)}`}>
                {getLimitDisplay(documentCount, userLimits?.document_limit || 5, hasProAccess)}
              </span>
            </div>
          </div>

          {/* Message Usage Meter for Free Users */}
          {!hasProAccess && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Message Usage</span>
                <span className="text-muted-foreground">{messageCount} / {messageLimit}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {isLimitReached 
                    ? "Limit reached - upgrade to continue"
                    : `${messagesRemaining} messages remaining this month`
                  }
                </span>
                <span className={`font-medium ${
                  usagePercentage > 80 ? 'text-red-600' : 
                  usagePercentage > 60 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {Math.round(usagePercentage)}% used
                </span>
              </div>
            </div>
          )}

          {/* Limit Reached Warning */}
          {isLimitReached && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-semibold text-red-900">Message Limit Reached</h4>
              </div>
              <p className="text-sm text-red-700 mb-3">
                You've used all {messageLimit} free messages this month. Upgrade to Pro for unlimited messaging.
              </p>
              <Button 
                onClick={() => setShowPricingModal(true)} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                See Plans
              </Button>
            </div>
          )}

          {/* Upgrade CTA for Free Users */}
          {!hasProAccess && !isLimitReached && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Upgrade to Pro</h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Get unlimited messages, advanced analytics, and priority support.
              </p>
              <Button 
                onClick={() => setShowPricingModal(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                See Plans
              </Button>
            </div>
          )}

          {/* Pro User Management */}
          {isProUser && (
            <div className="space-y-3">
              <Button onClick={handleManageSubscription} variant="outline" className="w-full">
                Manage Subscription
              </Button>
              <Button onClick={handleDowngrade} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                Downgrade to Free
              </Button>
            </div>
          )}
        </CardContent>
      </Card>



      {/* AppSumo Code Redemption */}
      {!appsumoAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              AppSumo Code
            </CardTitle>
            <CardDescription>
              Have an AppSumo code? Redeem it here for lifetime Pro access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="appsumo-code">AppSumo Code</Label>
                <Input
                  id="appsumo-code"
                  value={appsumoCode}
                  onChange={(e) => setAppsumoCode(e.target.value)}
                  placeholder="Enter your AppSumo code"
                />
              </div>
            </div>
            <Button 
              onClick={handleRedeemCode} 
              disabled={redeeming || !appsumoCode.trim()}
              className="w-full"
            >
              {redeeming ? "Redeeming..." : "Redeem Code"}
            </Button>
          </CardContent>
        </Card>
      )}



      {/* Usage Refresh */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={refreshUsage}>
          Refresh Usage
        </Button>
      </div>

      {/* Pricing Modal */}
      <PricingWidget 
        starterMonth={199}
        starterAnnual={79.67} // $956/12 months
        proMonth={199}
        proAnnual={79.67} // $956/12 months
        open={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
};

export default BillingSection;
