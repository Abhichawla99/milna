
import { useState, useEffect } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { toast } from "@/frontend/hooks/use-toast";
import { 
  User, 
  CreditCard, 
  Users, 
  Settings, 
  Mail,
  Edit,
  Trash2,
  Plus,
  Crown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { useUser } from "@/frontend/hooks/use-user";
import { supabase } from "@/integrations/supabase/client";
import { PricingWidget } from "@/frontend/components/upgrade/PricingWidget";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_at: string;
}

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string | null;
}

const UserProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    company: '',
    phone: ''
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTeamMembers();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          company: data.company || '',
          phone: data.phone || ''
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
    }
  };

  const loadTeamMembers = async () => {
    try {
      // Mock team members for now
      setTeamMembers([
        {
          id: '1',
          email: user?.email || '',
          role: 'owner',
          status: 'active',
          invited_at: new Date().toISOString()
        }
      ]);
    } catch (error: any) {
      console.error('Error loading team members:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteTeamMember = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Mock invite for now
      const newMember: TeamMember = {
        id: crypto.randomUUID(),
        email: inviteEmail,
        role: inviteRole,
        status: 'pending',
        invited_at: new Date().toISOString()
      };

      setTeamMembers([...teamMembers, newMember]);
      setInviteEmail('');
      setIsInviteDialogOpen(false);

      toast({
        title: "Invitation Sent! 📧",
        description: `Invite sent to ${inviteEmail}`,
      });
    } catch (error: any) {
      console.error('Error inviting team member:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = async (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    toast({
      title: "Member Removed",
      description: "Team member has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5" />
        <h3 className="text-lg font-semibold">User Profile</h3>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <Button onClick={saveProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Current Plan</h4>
                  <p className="text-sm text-muted-foreground">Free Plan</p>
                </div>
                <Badge variant="secondary">Free</Badge>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Upgrade to Pro</h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Unlock powerful integrations, advanced analytics, and team collaboration features.
                </p>
                <Button 
                  variant="default" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade to Pro - Starting at $199/month
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Billing Information</h4>
                <p className="text-sm text-muted-foreground">No billing information on file</p>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Invite team members and manage access to your agents.
                  </CardDescription>
                </div>
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team and collaborate on agents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-email" className="text-right">
                Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="col-span-3"
                placeholder="member@company.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-role" className="text-right">
                Role
              </Label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <Button onClick={inviteTeamMember} disabled={loading}>
            {loading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <PricingWidget 
        starterMonth={199}
        starterAnnual={79.67} // $956/12 months
        proMonth={199}
        proAnnual={79.67} // $956/12 months
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default UserProfile;
