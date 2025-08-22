import NumberFlow from '@number-flow/react'
import React from "react";
import { useUser } from '@/frontend/hooks/use-user';
import { useToast } from '@/frontend/components/ui/use-toast';
import { Dialog, DialogContent } from '@/frontend/components/ui/dialog';

interface PricingWidgetProps {
  starterMonth: number;
  starterAnnual: number;
  proMonth: number;
  proAnnual: number;
  open: boolean;
  onClose: () => void;
}

export function PricingWidget ({
  starterMonth,
  starterAnnual,
  proMonth,
  proAnnual,
  open,
  onClose,
}: PricingWidgetProps) {
  const [active, setActive] = React.useState(0);
  const [period, setPeriod] = React.useState(1); // Default to yearly (annual)
  const { toast } = useToast();
  const { user } = useUser();

  const handleChangePlan = (index: number) => {
    setActive(index);
  };

  const handleChangePeriod = (index: number) => {
    setPeriod(index);
    if (index === 0) {
      setPro(proMonth);
    } else {
      setPro(proAnnual);
    }
  };

  const [pro, setPro] = React.useState(proAnnual); // Default to annual

  const handleGetStarted = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your account.",
        variant: "destructive",
      });
      return;
    }

    if (active === 0) {
      // Free plan - no action needed
      toast({
        title: "Already on Free Plan",
        description: "You're already using the free plan!",
      });
      return;
    }

    if (active === 2) {
      // Custom plan - contact us
      toast({
        title: "Contact Us",
        description: "Please contact us for custom pricing and features.",
      });
      return;
    }

    // Pro plan (active === 1)
    let stripeUrl: string;
    if (period === 0) { // Monthly
      stripeUrl = 'https://buy.stripe.com/8x26oJ3sZ25s8qT7fP3Je0c'; // $199/month
    } else { // Yearly
      stripeUrl = 'https://buy.stripe.com/8x200l2oV6lI9uX2Zz3Je0d'; // $956/year
    }

    try {
      // Construct Stripe checkout URL with user metadata
      const checkoutUrl = new URL(stripeUrl);
      
      // Add user_id as client_reference_id (crucial for n8n workflow)
      checkoutUrl.searchParams.append('client_reference_id', user.id);
      checkoutUrl.searchParams.append('prefilled_email', user.email || '');
      
      // Open Stripe checkout
      window.open(checkoutUrl.toString(), '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "You'll get pro access immediately after payment!",
      });
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-0 shadow-none">
        <div className="border-2 rounded-[32px] p-3 shadow-md max-w-sm w-full flex flex-col items-center gap-3 bg-white mx-auto">
        <div className="rounded-full relative w-full bg-slate-100 p-1.5 flex items-center">
          <button
            className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20"
            onClick={() => handleChangePeriod(0)}
          >
            Monthly
          </button>
          <button
            className="font-semibold rounded-full w-full p-1.5 text-slate-800 z-20"
            onClick={() => handleChangePeriod(1)}
          >
            Yearly
          </button>
          <div
            className="p-1.5 flex items-center justify-center absolute inset-0 w-1/2 z-10"
            style={{
              transform: `translateX(${period * 100}%)`,
              transition: "transform 0.3s",
            }}
          >
            <div className="bg-white shadow-sm rounded-full w-full h-full"></div>
          </div>
        </div>
        <div className="w-full relative flex flex-col items-center justify-center gap-3">
          <div
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl h-[120px]"
            onClick={() => handleChangePlan(0)}
          >
            <div className="flex flex-col items-start justify-center h-full">
              <p className="font-semibold text-xl text-gray-950">Free</p>
              <p className="text-slate-500 text-md">
                <span className="text-black font-medium">$0.00</span>/month
              </p>
              <p className="text-xs text-slate-400 mt-1">3 agents • 100 messages</p>
            </div>
            <div
              className="border-2 border-slate-500 size-6 rounded-full p-1 flex items-center justify-center self-center"
              style={{
                borderColor: `${active === 0 ? "#000" : "#64748b"}`,
                transition: "border-color 0.3s",
              }}
            >
              <div
                className="size-3 bg-black rounded-full"
                style={{
                  opacity: `${active === 0 ? 1 : 0}`,
                  transition: "opacity 0.3s",
                }}
              ></div>
            </div>
          </div>
          <div
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl h-[120px]"
            onClick={() => handleChangePlan(1)}
          >
            <div className="flex flex-col items-start justify-center h-full">
              <p className="font-semibold text-xl flex items-center gap-2 text-gray-950">
                Pro{" "}
                <span className="py-1 px-2 block rounded-lg bg-yellow-100 text-yellow-950 text-sm">
                  Popular
                </span>
              </p>
              <p className="text-slate-500 text-md flex">
                <span className="text-black font-medium flex items-center">
                  ${" "}
                  <NumberFlow
                    className="text-black font-medium"
                    value={pro}
                  />
                </span>
                /month
              </p>
              <p className="text-xs text-slate-400 mt-1">7 agents • Unlimited messages • Priority support</p>
            </div>
            <div
              className="border-2 border-slate-500 size-6 rounded-full p-1 flex items-center justify-center self-center"
              style={{
                borderColor: `${active === 1 ? "#000" : "#64748b"}`,
                transition: "border-color 0.3s",
              }}
            >
              <div
                className="size-3 bg-black rounded-full"
                style={{
                  opacity: `${active === 1 ? 1 : 0}`,
                  transition: "opacity 0.3s",
                }}
              ></div>
            </div>
          </div>
          <div
            className="w-full flex justify-between cursor-pointer border-2 border-gray-400 p-4 rounded-2xl h-[120px]"
            onClick={() => handleChangePlan(2)}
          >
            <div className="flex flex-col items-start justify-center h-full">
              <p className="font-semibold text-xl text-gray-950">Custom</p>
              <p className="text-slate-500 text-md flex">
                <span className="text-black font-medium flex items-center">
                  Contact Us
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Unlimited agents • Custom integrations • Dedicated support</p>
            </div>
            <div
              className="border-2 border-slate-500 size-6 rounded-full p-1 flex items-center justify-center self-center"
              style={{
                borderColor: `${active === 2 ? "#000" : "#64748b"}`,
                transition: "border-color 0.3s",
              }}
            >
              <div
                className="size-3 bg-black rounded-full"
                style={{
                  opacity: `${active === 2 ? 1 : 0}`,
                  transition: "opacity 0.3s",
                }}
              ></div>
            </div>
          </div>
          <div
            className={`w-full h-[120px] absolute top-0 border-[3px] border-black rounded-2xl pointer-events-none`}
            style={{
              transform: `translateY(${active === 0 ? 0 : active === 1 ? 132 : 264}px)`,
              transition: "transform 0.3s",
            }}
          ></div>
        </div>
        <button 
          className="rounded-full bg-black text-lg text-white w-full p-3 active:scale-95 transition-transform duration-300"
          onClick={handleGetStarted}
        >
          {active === 0 ? "Current Plan" : active === 2 ? "Contact Us" : "Get Started"}
        </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
