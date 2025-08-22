
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { 
  BarChart3, 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Activity,
  Calendar,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Agent {
  id: string;
  name: string;
  analytics_data?: any;
}

interface AgentAnalyticsTabProps {
  agent: Agent;
}

interface ChatSession {
  id: string;
  visitor_id: string;
  messages_count: number;
  duration_seconds: number;
  created_at: string;
}

const AgentAnalyticsTab = ({ agent }: AgentAnalyticsTabProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [agent.id]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("agent_id", agent.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setChatSessions(data || []);
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalSessions = chatSessions.length;
  const totalMessages = chatSessions.reduce((sum, session) => sum + session.messages_count, 0);
  const avgMessagesPerSession = totalSessions > 0 ? (totalMessages / totalSessions).toFixed(1) : "0";
  const avgSessionDuration = totalSessions > 0
    ? Math.round(chatSessions.reduce((sum, session) => sum + session.duration_seconds, 0) / totalSessions)
    : 0;

  // Get unique visitors
  const uniqueVisitors = new Set(chatSessions.map(session => session.visitor_id)).size;

  // Get sessions from last 7 days
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const recentSessions = chatSessions.filter(
    session => new Date(session.created_at) > lastWeek
  );

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Agent Analytics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              All-time conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">Messages exchanged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">Different users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSessionDuration}s</div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Messages per Session</span>
              <Badge variant="secondary">{avgMessagesPerSession}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sessions This Week</span>
              <Badge variant="secondary">{recentSessions.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Engagement Rate</span>
              <Badge variant="secondary">
                {totalSessions > 0 ? Math.round((totalMessages / totalSessions) * 10) : 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest chat sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {chatSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No chat sessions yet</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {chatSessions.slice(0, 10).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        Session {session.id.slice(0, 8)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString()} at{" "}
                        {new Date(session.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {session.messages_count} msgs
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {session.duration_seconds}s
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentAnalyticsTab;
