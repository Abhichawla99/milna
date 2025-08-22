import { motion } from "framer-motion";
import EmbeddedAgent from "@/frontend/components/EmbeddedAgent";
import EmbeddedAgentStandalone from "@/frontend/components/EmbeddedAgentStandalone";

const EmbeddedAgentDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500" />
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Meet Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Assistant
                </span>
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Experience the future of customer support with our intelligent AI agent. 
                Ask questions, get instant responses, and enjoy seamless conversations.
              </p>
              
              <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Always Available</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Instant Responses</span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Embedded Agent Section */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Start a Conversation
            </h2>
            <p className="text-gray-600">
              Click on the search bar below to begin chatting with your AI assistant
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <EmbeddedAgent
              agentUrl="https://ebfbe489-fc0d-489d-b25f-794d5e30a856.lovableproject.com/agent/agent_aa1f9f83_ef1d_4ada_bb7f_b5c9e517e36c"
              agentName="PaperKites AI"
              className="mb-8"
            />
          </motion.div>
          
          {/* Floating Chat Widget */}
          <EmbeddedAgentStandalone
            agentUrl="https://ebfbe489-fc0d-489d-b25f-794d5e30a856.lovableproject.com/agent/agent_aa1f9f83_ef1d_4ada_bb7f_b5c9e517e36c"
            agentName="PaperKites AI"
            position="bottom-right"
            theme="light"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-white/50">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Assistant?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of technology and human-like interaction
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Intelligent Responses",
                description: "Powered by advanced AI that understands context and provides relevant answers"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Get instant responses without waiting in queues or dealing with delays"
              },
              {
                icon: "🌍",
                title: "Always Available",
                description: "24/7 support that never sleeps, ready to help whenever you need it"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddedAgentDemo;
