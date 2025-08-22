
import { motion } from "framer-motion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { ArrowRight, Calendar, User, Clock, TrendingUp, Bot, Zap, Shield, Globe, MessageSquare, Code, Rocket, BookOpen } from "lucide-react";
import FloralDecorations from "@/frontend/components/marketing/FloralDecorations";
import { Link } from "react-router-dom";

const Blog = () => {
  const blogPosts = [
    {
      title: "AI Agents vs Chatbots: The Complete Guide to Autonomous Intelligence (2024)",
      excerpt: "Discover the fundamental differences between AI agents and chatbots. Learn how autonomous AI agents are revolutionizing business automation and customer interaction.",
      author: "Dr. Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "12 min read",
      category: "AI Agents",
      image: "/placeholder.svg",
      slug: "ai-agents-vs-chatbots-complete-guide-2024",
      keywords: ["AI agent", "AI agent vs chatbot", "autonomous AI agent", "artificial intelligence agent"],
      icon: Bot,
      iconColor: "bg-blue-500"
    },
    {
      title: "How to Build an AI Agent: Step-by-Step Development Guide 2024",
      excerpt: "Master AI agent development with our comprehensive guide. From concept to deployment, learn how to create intelligent, autonomous agents that transform your business.",
      author: "Mike Chen",
      date: "Dec 14, 2024",
      readTime: "18 min read",
      category: "Development",
      image: "/placeholder.svg",
      slug: "how-to-build-ai-agent-step-by-step-guide-2024",
      keywords: ["how to build an AI agent", "AI agent development", "AI agent framework", "autonomous AI agent"],
      icon: Code,
      iconColor: "bg-green-500"
    },
    {
      title: "Best AI Agent Platforms 2024: Top 15 Solutions Compared",
      excerpt: "Comprehensive comparison of the top AI agent platforms. Features, pricing, pros and cons to help you choose the perfect AI agent solution for your business.",
      author: "Emma Davis",
      date: "Dec 13, 2024",
      readTime: "20 min read",
      category: "Platforms",
      image: "/placeholder.svg",
      slug: "best-ai-agent-platforms-2024-top-solutions-compared",
      keywords: ["best AI agent platforms 2024", "AI agent platform", "AI agent solutions", "autonomous AI agent"],
      icon: Globe,
      iconColor: "bg-purple-500"
    },
    {
      title: "AI Agent Use Cases: 25 Real-World Applications That Are Transforming Industries",
      excerpt: "Explore 25 powerful AI agent use cases across different industries. See how autonomous AI agents are solving complex problems and driving innovation.",
      author: "Alex Rodriguez",
      date: "Dec 12, 2024",
      readTime: "15 min read",
      category: "Use Cases",
      image: "/placeholder.svg",
      slug: "ai-agent-use-cases-25-real-world-applications",
      keywords: ["AI agent use cases", "AI agent examples", "AI agent applications", "autonomous AI agent"],
      icon: MessageSquare,
      iconColor: "bg-orange-500"
    },
    {
      title: "Autonomous AI Agents: The Future of Business Automation",
      excerpt: "Discover how autonomous AI agents are reshaping business automation. Learn about the latest developments in AI agent technology and their impact on various industries.",
      author: "Lisa Wang",
      date: "Dec 11, 2024",
      readTime: "14 min read",
      category: "Automation",
      image: "/placeholder.svg",
      slug: "autonomous-ai-agents-future-business-automation",
      keywords: ["autonomous AI agent", "AI agent automation", "business automation", "artificial intelligence agent"],
      icon: Zap,
      iconColor: "bg-yellow-500"
    },
    {
      title: "AI Agent Frameworks: LangChain vs AutoGen vs Custom Solutions",
      excerpt: "In-depth comparison of leading AI agent frameworks. Understand the pros and cons of LangChain, AutoGen, and custom solutions for building intelligent agents.",
      author: "David Miller",
      date: "Dec 10, 2024",
      readTime: "16 min read",
      category: "Frameworks",
      image: "/placeholder.svg",
      slug: "ai-agent-frameworks-langchain-vs-autogen-comparison",
      keywords: ["AI agent framework", "LangChain", "AutoGen", "AI agent development"],
      icon: Rocket,
      iconColor: "bg-red-500"
    },
    {
      title: "AI Agent for Business: Complete Implementation Strategy",
      excerpt: "Strategic guide to implementing AI agents in your business. Learn how to identify opportunities, choose the right approach, and maximize ROI from AI agent investments.",
      author: "Jennifer Lee",
      date: "Dec 9, 2024",
      readTime: "13 min read",
      category: "Business",
      image: "/placeholder.svg",
      slug: "ai-agent-for-business-complete-implementation-strategy",
      keywords: ["AI agent for business", "AI agent implementation", "business AI agent", "AI agent strategy"],
      icon: TrendingUp,
      iconColor: "bg-indigo-500"
    },
    {
      title: "Multi-Agent Systems: Orchestrating Intelligent AI Teams",
      excerpt: "Learn how to build and manage multi-agent systems. Discover strategies for coordinating multiple AI agents to solve complex problems and achieve business objectives.",
      author: "Robert Kim",
      date: "Dec 8, 2024",
      readTime: "17 min read",
      category: "Multi-Agent",
      image: "/placeholder.svg",
      slug: "multi-agent-systems-orchestrating-intelligent-ai-teams",
      keywords: ["multi-agent systems", "AI agent orchestration", "autonomous AI agent", "AI agent coordination"],
      icon: Shield,
      iconColor: "bg-teal-500"
    },
    {
      title: "AI Agent Security & Safety: Best Practices for Responsible Development",
      excerpt: "Essential security and safety considerations for AI agent development. Learn how to build secure, ethical, and reliable autonomous AI agents.",
      author: "Dr. Amanda Foster",
      date: "Dec 7, 2024",
      readTime: "11 min read",
      category: "Security",
      image: "/placeholder.svg",
      slug: "ai-agent-security-safety-best-practices",
      keywords: ["AI agent security", "AI agent safety", "responsible AI", "autonomous AI agent"],
      icon: Shield,
      iconColor: "bg-pink-500"
    },
    {
      title: "AI Agent Examples: 10 Inspiring Case Studies from Leading Companies",
      excerpt: "Real-world AI agent examples from companies like Google, Microsoft, and startups. See how different organizations are leveraging autonomous AI agents.",
      author: "Chris Thompson",
      date: "Dec 6, 2024",
      readTime: "12 min read",
      category: "Case Studies",
      image: "/placeholder.svg",
      slug: "ai-agent-examples-10-inspiring-case-studies",
      keywords: ["AI agent examples", "AI agent case studies", "autonomous AI agent", "AI agent applications"],
      icon: BookOpen,
      iconColor: "bg-emerald-500"
    },
    {
      title: "The Evolution of AI Agents: From Simple Bots to Autonomous Intelligence",
      excerpt: "Trace the evolution of AI agents from basic chatbots to sophisticated autonomous systems. Understand the technological breakthroughs that made modern AI agents possible.",
      author: "Dr. Michael Chang",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      category: "Evolution",
      image: "/placeholder.svg",
      slug: "evolution-ai-agents-simple-bots-autonomous-intelligence",
      keywords: ["AI agent evolution", "autonomous AI agent", "artificial intelligence agent", "AI agent history"],
      icon: TrendingUp,
      iconColor: "bg-cyan-500"
    },
    {
      title: "AI Agent Pricing: Complete Cost Analysis for 2024",
      excerpt: "Comprehensive cost analysis of AI agent platforms and development. Understand the true cost of building and deploying autonomous AI agents for your business.",
      author: "Rachel Green",
      date: "Dec 4, 2024",
      readTime: "9 min read",
      category: "Pricing",
      image: "/placeholder.svg",
      slug: "ai-agent-pricing-complete-cost-analysis-2024",
      keywords: ["AI agent pricing", "AI agent cost", "AI agent platform pricing", "autonomous AI agent cost"],
      icon: TrendingUp,
      iconColor: "bg-violet-500"
    }
  ];





  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-100 relative">
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-floral-orange/20 text-floral-orange border-floral-orange/30">
            AI Agent Insights
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI Agent Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Expert insights on AI agents, autonomous intelligence, and artificial intelligence agents. 
            Learn how to build, deploy, and optimize AI agents for maximum business impact.
          </p>
        </motion.div>



        {/* All Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.05 }}
              >
                <Card className="group bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white transition-all duration-300 hover:border-floral-orange/30 overflow-hidden shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-floral-orange/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-full ${post.iconColor} flex items-center justify-center shadow-lg`}>
                      <post.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs border-floral-orange/30 text-floral-orange">
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-floral-orange transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="w-full text-floral-orange hover:bg-floral-orange/10 hover:text-floral-orange rounded-full">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
                      className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Build Your AI Agent?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses using AI agents to automate processes, 
            enhance customer service, and drive innovation.
          </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg">
                    Start Building AI Agents
                    <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-4 shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
