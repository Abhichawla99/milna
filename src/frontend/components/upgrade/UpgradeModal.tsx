import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/frontend/components/ui/dialog';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Separator } from '@/frontend/components/ui/separator';
import { Check, Crown, CreditCard, Zap, Users, BarChart3, Globe, Shield } from 'lucide-react';
import { useToast } from '@/frontend/components/ui/use-toast';
import { useUser } from '@/frontend/hooks/use-user';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual');
  const { toast } = useToast();
  const { user } = useUser();

  const plans = {
    monthly: {
      stripeUrl: 'https://buy.stripe.com/8x26oJ3sZ25s8qT7fP3Je0c',
      price: '$199',
      period: 'month',
      savings: null
    },
    annual: {
      stripeUrl: 'https://buy.stripe.com/8x200l2oV6lI9uX2Zz3Je0d',
      price: '$956',
      period: 'year',
      savings: 'Save 60%'
    }
  };

  const currentPlanFeatures = [
    '1 AI Agent',
    '100 messages/month',
    'Basic customization',
    'Standard support',
    'Basic analytics'
  ];

  const proPlanFeatures = [
    'Up to 7 AI Agents',
    'Unlimited messages',
    'Advanced customization',
    'Priority support',
    'Advanced analytics',
    'All integrations',
    'Team collaboration',
    'Custom branding',
    'API access',
    'White-label solution'
  ];

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your account.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Construct Stripe checkout URL with user metadata
      const stripeUrl = new URL(plans[planType].stripeUrl);
      
      // Add user_id as client_reference_id (this is crucial!)
      stripeUrl.searchParams.append('client_reference_id', user.id);
      stripeUrl.searchParams.append('prefilled_email', user.email || '');
      
      // Open Stripe checkout
      window.open(stripeUrl.toString(), '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "You'll get pro access immediately after payment!",
      });
      
      onClose();
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Unlock unlimited AI agents, advanced features, and priority support
          </DialogDescription>
        </DialogHeader>

        {/* Plan Toggle */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Button
            variant={planType === 'monthly' ? 'default' : 'outline'}
            onClick={() => setPlanType('monthly')}
            className="min-w-[120px]"
          >
            Monthly
          </Button>
          <Button
            variant={planType === 'annual' ? 'default' : 'outline'}
            onClick={() => setPlanType('annual')}
            className="min-w-[120px]"
          >
            Annual
            {plans.annual.savings && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {plans.annual.savings}
              </Badge>
            )}
          </Button>
        </div>

        {/* Plan Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Current Plan */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Current Plan</h3>
              <p className="text-3xl font-bold text-gray-600">Free</p>
              <p className="text-gray-500">Forever</p>
            </div>
            
            <Separator className="my-4" />
            
            <ul className="space-y-3">
              {currentPlanFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-blue-500 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-3 py-1">
                <Crown className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-blue-900">Pro Plan</h3>
              <p className="text-3xl font-bold text-blue-600">{plans[planType].price}</p>
              <p className="text-blue-500">per {plans[planType].period}</p>
            </div>
            
            <Separator className="my-4" />
            
            <ul className="space-y-3">
              {proPlanFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-blue-800">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Upgrade to Pro - {plans[planType].price}/{plans[planType].period}
              </div>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Maybe Later
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Instant Access
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Cancel Anytime
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
