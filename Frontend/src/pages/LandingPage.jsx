
import { Link } from "react-router"
import {
  Code,
  Brain,
  Zap,
  Users,
  Trophy,
  MessageSquare,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Terminal,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-hidden relative" data-theme="dark">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
          <div className="navbar-start">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-content" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CodeBuddy
              </span>
            </div>
          </div>
          <div className="navbar-end">
            <div className="flex space-x-2">
              <Link to="/login" className="btn btn-ghost text-primary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero min-h-screen bg-gradient-to-br from-base-100 via-base-200/50 to-base-100">
          <div className="hero-content text-center max-w-6xl">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="mb-8">
                <div className="badge badge-primary badge-lg mb-6 animate-pulse">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Coding Platform
                </div>
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                    Code
                  </span>
                  <span className="text-base-content">Buddy</span>
                </h1>
                <p className="text-xl md:text-2xl text-base-content/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Master algorithms, solve coding challenges, and accelerate your programming journey with
                  <span className="text-primary font-semibold"> AI-powered assistance</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/signup" className="btn btn-primary btn-lg group">
                  <Play className="w-5 h-5 mr-2" />
                  Start Coding Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/demo" className="btn btn-outline btn-primary btn-lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Try AI Chat
                </Link>
              </div>

              {/* Stats */}
              <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200/50 backdrop-blur-sm">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Problems</div>
                  <div className="stat-value text-primary">1,500+</div>
                  <div className="stat-desc">Coding challenges</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Developers</div>
                  <div className="stat-value text-secondary">75K+</div>
                  <div className="stat-desc">Active learners</div>
                </div>
                <div className="stat">
                  <div className="stat-figure text-accent">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div className="stat-title">AI Responses</div>
                  <div className="stat-value text-accent">1M+</div>
                  <div className="stat-desc">Smart hints given</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-base-200/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Why Choose CodeBuddy?
                </span>
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                Experience the next generation of coding education with AI-powered features designed for modern
                developers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <FeatureCard
                icon={<MessageSquare className="w-8 h-8" />}
                title="AI Chat Assistant"
                description="Get instant explanations, hints, and personalized feedback on your solutions with our advanced AI companion."
                color="primary"
                delay="0"
              />
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Smart Progress Tracking"
                description="Visualize your coding journey with detailed analytics, skill assessments, and personalized learning paths."
                color="secondary"
                delay="100"
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Lightning Fast Learning"
                description="Accelerate your growth with AI-optimized problem recommendations and instant code execution."
                color="accent"
                delay="200"
              />
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Community Driven"
                description="Connect with fellow developers, share solutions, and learn from the best coding practices."
                color="success"
                delay="300"
              />
              <FeatureCard
                icon={<Trophy className="w-8 h-8" />}
                title="Competitive Coding"
                description="Participate in contests, climb leaderboards, and showcase your skills to top tech companies."
                color="warning"
                delay="400"
              />
              <FeatureCard
                icon={<BookOpen className="w-8 h-8" />}
                title="Comprehensive Learning"
                description="Master data structures, algorithms, and system design with our structured curriculum."
                color="info"
                delay="500"
              />
            </div>
          </div>
        </section>

        {/* AI Chat Showcase */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="card bg-base-200/50 backdrop-blur-md border border-base-300 shadow-2xl max-w-6xl mx-auto">
              <div className="card-body p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-4xl font-bold mb-6 text-base-content">Meet Your AI Coding Mentor</h3>
                    <p className="text-lg text-base-content/80 mb-8">
                      Our advanced AI understands your code, identifies patterns, and provides personalized guidance to
                      help you become a better programmer.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-base-content/80">Real-time code analysis and suggestions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-base-content/80">Personalized learning paths and recommendations</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-base-content/80">Intelligent problem-solving hints</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-base-content/80">Code optimization and best practices</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <AIChat />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 text-base-content">Ready to Level Up Your Coding?</h2>
              <p className="text-xl text-base-content/80 mb-8">
                Join thousands of developers who are already improving their skills with CodeBuddy's AI-powered
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="btn btn-accent btn-lg group">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/pricing" className="btn btn-outline btn-accent btn-lg">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer footer-center bg-base-300 text-base-content p-10">
          <aside>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-content" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CodeBuddy
              </span>
            </div>
            <p className="font-bold">CodeBuddy - Your AI-Powered Coding Companion</p>
            <p>Empowering developers since 2025</p>
          </aside>
          <nav>
            <div className="grid grid-flow-col gap-4">
              <Link to="/privacy" className="link link-hover">
                Privacy Policy
              </Link>
              <Link to="/terms" className="link link-hover">
                Terms of Service
              </Link>
              <Link to="/support" className="link link-hover">
                Support
              </Link>
              <Link to="/about" className="link link-hover">
                About
              </Link>
            </div>
          </nav>
          <aside>
            <p>&copy; {new Date().getFullYear()} CodeBuddy. All rights reserved.</p>
          </aside>
        </footer>
      </div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description, color, delay }) => (
  <div
    className={`card bg-base-200/50 backdrop-blur-sm border border-base-300 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="card-body p-6">
      <div
        className={`w-12 h-12 bg-${color}/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <div className={`text-${color}`}>{icon}</div>
      </div>
      <h3 className="card-title text-xl mb-3">{title}</h3>
      <p className="text-base-content/70 leading-relaxed">{description}</p>
    </div>
  </div>
)

const AIChat = () => (
  <div className="mockup-window border border-base-300 bg-base-100">
    <div className="bg-base-200 px-4 py-16">
      <div className="space-y-4">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="chat-bubble chat-bubble-primary">
            I can help you optimize this algorithm! Try using a hash map for O(1) lookup time.
          </div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble">Thanks! That reduced my time complexity significantly.</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="chat-bubble chat-bubble-primary">
            Great! Now let's work on the space complexity. Here's a more efficient approach...
          </div>
        </div>
      </div>
    </div>
  </div>
)

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
    <div className="absolute inset-0 opacity-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>
    </div>

    {/* Floating Code Snippets */}
    <div className="absolute top-20 left-10 animate-float opacity-20">
      <div className="mockup-code text-xs">
        <pre data-prefix="1">
          <code className="text-primary">function quickSort(arr) {"{"}</code>
        </pre>
        <pre data-prefix="2">
          <code className="text-secondary"> if (arr.length &lt;= 1) return arr;</code>
        </pre>
        <pre data-prefix="3">
          <code className="text-accent"> const pivot = arr[0];</code>
        </pre>
      </div>
    </div>

    <div className="absolute top-40 right-20 animate-float-delayed opacity-20">
      <div className="mockup-code text-xs">
        <pre data-prefix="$">
          <code className="text-success">class TreeNode:</code>
        </pre>
        <pre data-prefix="$">
          <code className="text-warning"> def __init__(self, val=0):</code>
        </pre>
        <pre data-prefix="$">
          <code className="text-error"> self.val = val</code>
        </pre>
      </div>
    </div>

    <div className="absolute bottom-32 left-20 animate-float opacity-20">
      <div className="mockup-code text-xs">
        <pre data-prefix="1">
          <code className="text-info">const binarySearch = (arr, target) =&gt; {"{"}</code>
        </pre>
        <pre data-prefix="2">
          <code className="text-primary"> let left = 0, right = arr.length - 1;</code>
        </pre>
        <pre data-prefix="3">
          <code className="text-secondary"> while (left &lt;= right) {"{"}</code>
        </pre>
      </div>
    </div>
  </div>
)

export default LandingPage
