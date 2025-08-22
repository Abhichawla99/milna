import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { ArrowLeft, Mail, MessageCircle, BookOpen, Video, FileText, Search, Zap, Shield, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/frontend/components/layout/Footer";

const HelpCenter = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "bg-blue-500",
      faqs: [
        {
          question: "How do I create my first AI agent?",
          answer: "Creating your first AI agent is simple! Sign up for a free account, click 'Create Agent' in your dashboard, and follow our step-by-step wizard. You can customize personality, upload knowledge documents, and embed it on your website in minutes."
        },
        {
          question: "What's the difference between Free and Pro plans?",
          answer: "Free plan includes 3 agents and 100 messages per month. Pro plan gives you up to 7 agents, unlimited messages, priority support, and advanced analytics. Custom plans are available for enterprise needs."
        },
        {
          question: "How do I embed the chat widget on my website?",
          answer: "After creating your agent, you'll receive a unique embed code. Simply copy this code and paste it into your website's HTML. The chat widget will appear instantly and start helping your visitors."
        }
      ]
    },
    {
      title: "Account & Billing",
      icon: Settings,
      color: "bg-green-500",
      faqs: [
        {
          question: "How do I upgrade to Pro?",
          answer: "You can upgrade anytime from your dashboard. Click 'Upgrade to Pro' and choose between monthly ($199) or annual ($956) billing. Annual plans save you 60% compared to monthly."
        },
        {
          question: "Can I cancel my subscription?",
          answer: "Yes, you can cancel your subscription anytime from your account settings. You'll continue to have access until the end of your current billing period."
        },
        {
          question: "How do I update my payment information?",
          answer: "Go to your account settings and click 'Manage Subscription'. This will take you to our secure payment portal where you can update your payment method."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: Shield,
      color: "bg-purple-500",
      faqs: [
        {
          question: "The chat widget isn't appearing on my website",
          answer: "First, make sure the embed code is placed in the correct location (usually before the closing </body> tag). Clear your browser cache and check if there are any JavaScript errors in your browser's developer console."
        },
        {
          question: "My agent isn't responding correctly",
          answer: "Check your agent's knowledge base and make sure relevant documents are uploaded. You can also review conversation logs in your dashboard to see what might be causing issues."
        },
        {
          question: "How do I customize the chat widget appearance?",
          answer: "You can customize colors, fonts, and positioning through the embed code parameters. Check our documentation for detailed customization options."
        }
      ]
    }
  ];

  const supportOptions = [
    {
      title: "Email Support",
      description: "Get help from our expert team",
      icon: Mail,
      action: "Contact Support",
      href: "mailto:abhi@milna.dev?subject=Help Center Support",
      color: "bg-blue-500"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      action: "Start Chat",
      href: "mailto:abhi@milna.dev?subject=Live Chat Support",
      color: "bg-green-500"
    },
    {
      title: "Documentation",
      description: "Browse our comprehensive guides",
      icon: BookOpen,
      action: "View Docs",
      href: "mailto:abhi@milna.dev?subject=Documentation Request",
      color: "bg-purple-500"
    },
    {
      title: "Video Tutorials",
      description: "Learn with step-by-step videos",
      icon: Video,
      action: "Watch Videos",
      href: "mailto:abhi@milna.dev?subject=Video Tutorial Request",
      color: "bg-orange-500"
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
              Support
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              How can we help?
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find answers to common questions, get technical support, or contact our team directly.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {supportOptions.map((option, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{option.description}</p>
                  <a href={option.href}>
                    <Button variant="outline" className="w-full">
                      {option.action}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to the most common questions about Milna AI agents.
            </p>
          </motion.div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + categoryIndex * 0.1 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-border pb-4 last:border-b-0">
                        <h4 className="font-semibold mb-2 text-foreground">{faq.question}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
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
                <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
                <p className="text-muted-foreground mb-6">
                  Our support team is here to help you get the most out of Milna. 
                  We typically respond within 24 hours.
                </p>
                <div className="space-y-4">
                  <a href="mailto:abhi@milna.dev?subject=Help Center Support">
                    <Button size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support Team
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

export default HelpCenter;
