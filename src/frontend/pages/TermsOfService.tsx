import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Mail, FileText, Scale, Shield, Users, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/frontend/components/layout/Footer";

const TermsOfService = () => {
  const lastUpdated = "December 15, 2024";

  const termsSections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      color: "bg-green-500",
      content: [
        "By accessing or using Milna's services, you agree to be bound by these Terms of Service",
        "These terms apply to all users, customers, and visitors of our platform",
        "We reserve the right to modify these terms at any time with notice",
        "Continued use after changes constitutes acceptance of new terms",
        "If you disagree with any terms, you must discontinue use of our services"
      ]
    },
    {
      title: "Service Description",
      icon: FileText,
      color: "bg-blue-500",
      content: [
        "Milna provides AI agent creation and management services",
        "Services include agent customization, embedding, and analytics",
        "We offer various subscription plans with different features and limits",
        "Services are provided 'as is' and may be subject to availability",
        "We may update, modify, or discontinue services with notice"
      ]
    },
    {
      title: "User Responsibilities",
      icon: Users,
      color: "bg-purple-500",
      content: [
        "Provide accurate and complete information when creating an account",
        "Maintain the security of your account credentials",
        "Use services in compliance with applicable laws and regulations",
        "Not use services for illegal, harmful, or unauthorized purposes",
        "Respect intellectual property rights and privacy of others",
        "Report any security vulnerabilities or suspicious activity"
      ]
    },
    {
      title: "Payment Terms",
      icon: Scale,
      color: "bg-orange-500",
      content: [
        "Subscription fees are billed in advance on a monthly or annual basis",
        "All payments are processed securely through Stripe",
        "Prices may change with 30 days notice to existing customers",
        "Refunds are provided according to our refund policy",
        "Failed payments may result in service suspension",
        "Taxes are not included and are the responsibility of the customer"
      ]
    },
    {
      title: "Intellectual Property",
      icon: Shield,
      color: "bg-red-500",
      content: [
        "Milna retains ownership of our platform, software, and technology",
        "Users retain ownership of their content and data",
        "You grant us license to use your content to provide services",
        "We respect intellectual property rights and respond to DMCA notices",
        "Custom integrations and modifications remain your property",
        "Open source components are subject to their respective licenses"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: AlertTriangle,
      color: "bg-yellow-500",
      content: [
        "Our liability is limited to the amount paid for services in the past 12 months",
        "We are not liable for indirect, incidental, or consequential damages",
        "Services are provided without warranties of any kind",
        "We are not responsible for third-party services or integrations",
        "Force majeure events may affect service availability",
        "Users are responsible for backing up their data"
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
              Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. They govern your use of Milna's AI agent platform.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {termsSections.map((section, index) => (
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
                <h3 className="text-2xl font-bold mb-4">Questions About Terms?</h3>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about these Terms of Service or need clarification on any section, 
                  please contact our legal team.
                </p>
                <div className="space-y-4">
                  <a href="mailto:abhi@milna.dev?subject=Terms of Service Question">
                    <Button size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Legal Team
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

export default TermsOfService;
