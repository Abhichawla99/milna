import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Sparkles, Bot, MessageSquare, Upload, Settings, Rocket, CheckCircle } from "lucide-react";

interface WelcomeAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  companyName: string;
  onRefreshDashboard: () => void;
}

const WelcomeAgentModal: React.FC<WelcomeAgentModalProps> = ({
  isOpen,
  onClose,
  agentName,
  companyName,
  onRefreshDashboard
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const triggerConfetti = () => {
    // Simple confetti effect using CSS animations
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
      confetti.style.animationName = 'confetti-fall';
      confetti.style.borderRadius = '50%';
      confettiContainer.appendChild(confetti);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(confettiContainer);
    
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
      document.head.removeChild(style);
    }, 5000);
  };

  const steps = [
    {
      icon: <Sparkles className="w-12 h-12 text-yellow-500" />,
      title: "🎉 Your First AI Agent is Being Created!",
      description: `We're building ${agentName} using all the information from your website and company details.`,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">{agentName}</h3>
                <p className="text-sm text-blue-700">Your intelligent AI assistant</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Analyzing your company: {companyName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Setting up intelligent responses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Preparing for customer interactions</span>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600">
            This will only take a moment...
          </p>
        </div>
      ),
      buttonText: "Next: Learn How to Configure",
      buttonIcon: <Settings className="w-4 h-4" />
    },
    {
      icon: <Settings className="w-12 h-12 text-blue-500" />,
      title: "🚀 Now Let's Make It Perfect!",
      description: "Your agent is ready! Follow these steps to customize it for your business:",
      content: (
        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Click on Your Agent
              </CardTitle>
              <CardDescription>
                Find your agent in the dashboard and click to open the configuration panel
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Configure Your Agent
              </CardTitle>
              <CardDescription>
                Set the goal, tone, and any additional instructions to match your business needs
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5 text-purple-600" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Add any necessary documents to the knowledge base - product info, FAQs, policies, etc.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Start Chatting!
              </CardTitle>
              <CardDescription>
                Test your agent with some questions to see how it responds
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ),
      buttonText: "Perfect! Take Me to My Agent",
      buttonIcon: <Rocket className="w-4 h-4" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    setIsClosing(true);
    
    // Trigger confetti
    triggerConfetti();

    // Close modal and refresh dashboard after animation
    setTimeout(() => {
      onRefreshDashboard();
      onClose();
      setIsClosing(false);
      setCurrentStep(0);
    }, 1500);
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {currentStepData.icon}
          </div>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentStepData.title}
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            {currentStepData.description}
          </p>
        </DialogHeader>

        <div className="mt-6">
          {currentStepData.content}
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={isClosing}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
              >
                {isClosing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading Dashboard...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentStepData.buttonIcon}
                    {currentStepData.buttonText}
                  </div>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
              >
                <div className="flex items-center gap-2">
                  {currentStepData.buttonIcon}
                  {currentStepData.buttonText}
                </div>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeAgentModal;
