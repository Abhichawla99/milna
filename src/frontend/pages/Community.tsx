import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Mail, Users, MessageCircle, Heart, Star, Share2, Calendar, MapPin, Globe, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/frontend/components/layout/Footer";

const Community = () => {
  const communityFeatures = [
    {
      title: "User Forums",
      description: "Connect with other Milna users, share tips, and get answers to your questions",
      icon: MessageCircle,
      color: "bg-blue-500",
      status: "Coming Soon"
    },
    {
      title: "Expert Network",
      description: "Access our network of AI experts and certified consultants",
      icon: Users,
      color: "bg-green-500",
      status: "Coming Soon"
    },
    {
      title: "Success Stories",
      description: "Learn from real-world implementations and case studies",
      icon: Heart,
      color: "bg-purple-500",
      status: "Coming Soon"
    },
    {
      title: "Beta Program",
      description: "Get early access to new features and help shape the future of Milna",
      icon: Star,
      color: "bg-orange-500",
      status: "Coming Soon"
    }
  ];

  const upcomingEvents = [
    {
      title: "Milna User Meetup",
      date: "January 15, 2025",
      time: "2:00 PM EST",
      location: "Virtual",
      description: "Join us for our monthly user meetup to discuss best practices and new features.",
      attendees: 45
    },
    {
      title: "AI Agent Workshop",
      date: "January 22, 2025",
      time: "1:00 PM EST",
      location: "Virtual",
      description: "Learn advanced techniques for building and optimizing your AI agents.",
      attendees: 32
    },
    {
      title: "Community Q&A",
      date: "January 29, 2025",
      time: "3:00 PM EST",
      location: "Virtual",
      description: "Ask questions directly to our product team and get expert advice.",
      attendees: 28
    }
  ];

  const socialChannels = [
    {
      name: "Twitter",
      handle: "@MilnaAI",
      description: "Follow us for product updates and AI insights",
      icon: Twitter,
      color: "bg-blue-400",
      href: "mailto:abhi@milna.dev?subject=Twitter Community"
    },
    {
      name: "LinkedIn",
      handle: "Milna AI",
      description: "Connect with our team and other professionals",
      icon: Linkedin,
      color: "bg-blue-600",
      href: "mailto:abhi@milna.dev?subject=LinkedIn Community"
    },
    {
      name: "GitHub",
      handle: "milna-ai",
      description: "Contribute to open-source projects and integrations",
      icon: Github,
      color: "bg-gray-800",
      href: "mailto:abhi@milna.dev?subject=GitHub Community"
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
              Community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Join the Milna Community
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with fellow AI enthusiasts, share knowledge, and help shape the future of AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:abhi@milna.dev?subject=Community Interest">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </a>
              <a href="mailto:abhi@milna.dev?subject=Community Feedback">
                <Button size="lg" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share Feedback
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Community Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're building a comprehensive community platform to help you connect, learn, and grow with Milna.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{feature.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {feature.status}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our virtual events to learn, network, and stay updated with the latest in AI agents.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.date}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.attendees} attending
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <a href="mailto:abhi@milna.dev?subject=Event Registration: {event.title}">
                      <Button variant="outline" size="sm" className="w-full">
                        Register Interest
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Channels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow us on social media for the latest updates, tips, and community highlights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {socialChannels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${channel.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <channel.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{channel.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">@{channel.handle}</p>
                    <p className="text-muted-foreground mb-4 text-sm">{channel.description}</p>
                    <a href={channel.href}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </a>
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
                <h3 className="text-2xl font-bold mb-4">Get Involved</h3>
                <p className="text-muted-foreground mb-6">
                  Want to contribute to the community or have ideas for new features? 
                  We'd love to hear from you!
                </p>
                <div className="space-y-4">
                  <a href="mailto:abhi@milna.dev?subject=Community Involvement">
                    <Button size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Community Team
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

export default Community;
