import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Mail, Shield, Eye, Lock, Users, Database, Globe, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/frontend/components/layout/Footer";

const PrivacyPolicy = () => {
  const lastUpdated = "December 15, 2024";

  const privacySections = [
    {
      title: "Information We Collect",
      icon: Database,
      color: "bg-blue-500",
      content: [
        "Personal information (name, email, company) when you create an account",
        "Usage data and analytics to improve our services",
        "Conversation data from your AI agents (stored securely)",
        "Technical information about your device and browser",
        "Payment information processed securely through Stripe"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      color: "bg-green-500",
      content: [
        "Provide and maintain our AI agent services",
        "Process payments and manage subscriptions",
        "Send important service updates and notifications",
        "Improve our products and develop new features",
        "Provide customer support and respond to inquiries",
        "Ensure security and prevent fraud"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      color: "bg-purple-500",
      content: [
        "All data is encrypted in transit and at rest",
        "We use industry-standard security practices",
        "Regular security audits and penetration testing",
        "Access controls and authentication measures",
        "Data backup and disaster recovery procedures",
        "Compliance with GDPR and other privacy regulations"
      ]
    },
    {
      title: "Data Sharing",
      icon: Users,
      color: "bg-orange-500",
      content: [
        "We do not sell your personal information to third parties",
        "Service providers (hosting, payment processing) with strict agreements",
        "Legal requirements when required by law",
        "Business transfers in case of merger or acquisition",
        "With your explicit consent for specific purposes"
      ]
    },
    {
      title: "Your Rights",
      icon: Shield,
      color: "bg-red-500",
      content: [
        "Access and download your personal data",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Opt-out of marketing communications",
        "Request data portability",
        "Lodge complaints with supervisory authorities"
      ]
    },
    {
      title: "Data Retention",
      icon: Calendar,
      color: "bg-indigo-500",
      content: [
        "Account data retained while your account is active",
        "Conversation logs retained for 30 days by default",
        "Analytics data retained for 12 months",
        "Payment records retained as required by law",
        "Data deleted upon account cancellation",
        "Backup data retained for 90 days"
      ]
    }
  ];

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
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Your Privacy Matters
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're committed to protecting your privacy and being transparent about how we collect, use, and safeguard your information.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="bg-card border-border hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-card border-border max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Privacy Questions?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please don't hesitate to contact us.
                </p>
                <div className="space-y-4">
                  <a href="mailto:abhi@milna.dev?subject=Privacy Policy Question">
                    <Button size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Privacy Team
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

export default PrivacyPolicy;
