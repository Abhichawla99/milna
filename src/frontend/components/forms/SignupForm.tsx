
import React, { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { useAuth } from "@/frontend/hooks/useAuth";
import { toast } from "sonner";
import { ensureUrlProtocol } from "@/frontend/utils/urlHelpers";

interface SignupFormProps {
  onSuccess?: () => void;
  isPricingFlow?: boolean;
  onPricingSuccess?: () => void;
}

export const SignupForm = ({ onSuccess, isPricingFlow, onPricingSuccess }: SignupFormProps) => {
  const { signup, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    website: "",
    hasPermission: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Normalize the website URL before submitting
      const normalizedWebsite = formData.website ? ensureUrlProtocol(formData.website) : "";
      
      await signup({
        ...formData,
        website: normalizedWebsite
      });
      
      if (isPricingFlow) {
        toast.success("Account created! Taking you to payment for the annual plan...");
        onPricingSuccess?.();
      } else {
        toast.success("Account created! Please check your email to confirm your account.");
        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="company">Company Name *</Label>
        <Input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => handleInputChange("company", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="text"
          value={formData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          placeholder="example.com (we'll add https:// for you)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="permission"
          checked={formData.hasPermission}
          onCheckedChange={(checked) => handleInputChange("hasPermission", checked as boolean)}
        />
        <Label htmlFor="permission" className="text-sm">
          I agree to the terms and conditions
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : (isPricingFlow ? "Create Account & Go to Payment" : "Sign Up")}
      </Button>
    </form>
  );
};
