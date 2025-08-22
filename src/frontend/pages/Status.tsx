import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Mail, CheckCircle, AlertCircle, XCircle, Clock, Activity, Server, Database, Globe, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/frontend/components/layout/Footer";

const Status = () => {
  const systemComponents = [
    {
      name: "API Services",
      status: "operational",
      description: "Core API endpoints and authentication",
      icon: Server,
      color: "text-green-500",
      bgColor: "bg-green-500"
    },
    {
      name: "Database",
      status: "operational",
      description: "Data storage and retrieval systems",
      icon: Database,
      color: "text-green-500",
      bgColor: "bg-green-500"
    },
    {
      name: "AI Processing",
      status: "operational",
      description: "AI agent processing and responses",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500"
    },
    {
      name: "CDN & Delivery",
      status: "operational",
      description: "Content delivery and caching",
      icon: Globe,
      color: "text-green-500",
      bgColor: "bg-green-500"
    },
    {
      name: "Security",
      status: "operational",
      description: "Security and authentication systems",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500"
    }
  ];

  const recentIncidents = [
    {
      title: "Scheduled Maintenance",
      date: "December 10, 2024",
      time: "2:00 AM - 4:00 AM EST",
      status: "resolved",
      description: "Routine database maintenance and performance optimizations completed successfully.",
      impact: "minor"
    },
    {
      title: "API Response Time Improvements",
      date: "December 5, 2024",
      time: "10:00 AM - 12:00 PM EST",
      status: "resolved",
      description: "Implemented caching improvements resulting in 40% faster API response times.",
      impact: "none"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "maintenance":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case "outage":
        return <Badge className="bg-red-100 text-red-800">Outage</Badge>;
      case "maintenance":
        return <Badge className="bg-blue-100 text-blue-800">Maintenance</Badge>;
      case "resolved":
        return <Badge className="bg-gray-100 text-gray-800">Resolved</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "none":
        return <Badge variant="outline" className="text-green-600 border-green-600">No Impact</Badge>;
      case "minor":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Minor</Badge>;
      case "major":
        return <Badge variant="outline" className="text-red-600 border-red-600">Major</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Milna
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              System Status
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              All Systems Operational
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Real-time status of Milna's services and infrastructure. We're committed to providing 99.9% uptime.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold text-green-600">All services are running normally</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* System Components */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">System Components</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Monitor the status of individual system components and services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemComponents.map((component, index) => (
              <motion.div
                key={component.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${component.bgColor} rounded-lg flex items-center justify-center`}>
                          <component.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{component.name}</h3>
                          <p className="text-sm text-muted-foreground">{component.description}</p>
                        </div>
                      </div>
                      {getStatusIcon(component.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(component.status)}
                      <span className="text-sm text-muted-foreground">Updated 2 min ago</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Recent Incidents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Historical incidents and maintenance updates.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {recentIncidents.map((incident, index) => (
              <motion.div
                key={incident.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{incident.title}</h3>
                        {getImpactBadge(incident.impact)}
                      </div>
                      {getStatusBadge(incident.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{incident.date}</span>
                      <span>•</span>
                      <span>{incident.time}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Performance Metrics</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key performance indicators and uptime statistics.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { metric: "99.9%", label: "Uptime (30 days)", color: "text-green-600" },
              { metric: "< 200ms", label: "Average Response Time", color: "text-blue-600" },
              { metric: "24/7", label: "Monitoring", color: "text-purple-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <Card className="bg-card border-border text-center">
                  <CardContent className="pt-6">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.metric}</div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center"
          >
            <Card className="bg-card border-border max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Report an Issue</h3>
                <p className="text-muted-foreground mb-6">
                  Experiencing problems with our services? Contact our technical support team for immediate assistance.
                </p>
                <div className="space-y-4">
                  <a href="mailto:abhi@milna.dev?subject=System Status Issue">
                    <Button size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Report Technical Issue
                    </Button>
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Email us at: <a href="mailto:abhi@milna.dev" className="text-primary hover:underline">abhi@milna.dev</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Status;
