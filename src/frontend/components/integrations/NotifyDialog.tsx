
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { toast } from "@/frontend/hooks/use-toast";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";

interface NotifyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotifyDialog = ({ isOpen, onClose }: NotifyDialogProps) => {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!notifyEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would typically save the email to a waitlist
      console.log('Adding to waitlist:', notifyEmail);
      
      toast({
        title: "You're on the list! 📧",
        description: "We'll notify you as soon as integrations are available.",
      });
      
      setNotifyEmail("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add email to waitlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Notified When Integrations Launch! 🚀</DialogTitle>
          <DialogDescription>
            Be the first to know when our powerful integrations become available with the Pro plan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="col-span-3"
              placeholder="your@email.com"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          <Bell className="w-4 h-4 mr-2" />
          {loading ? "Adding..." : "Notify Me"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NotifyDialog;
