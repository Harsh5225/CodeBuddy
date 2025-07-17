/* eslint-disable no-unused-vars */

import { Link } from "react-router";
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
  Rocket,
  Star,
  Award,
  Target,
  Lightbulb,
  Menu,
  X,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Monitor,
  Cpu,
  Database,
  Shield,
  Clock,
  BarChart3,
  Send,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Inline Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }

        @keyframes floatDelayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-1deg);
          }
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(147, 51, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes typewriter {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floatDelayed 8s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 300% 300%;
          animation: gradientShift 3s ease infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #2563eb);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden relative">
        {/* Enhanced Animated Background */}
        <CreativeAnimatedBackground />

        {/* Main Content */}
        <div className="relative z-10">
          {/* Enhanced Navigation */}
          <nav className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    CodeBuddy
                  </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                  {/* <Link
                    to="/features"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
                  >
                    Features
                  </Link>
                  <Link
                    to="/demo"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
                  >
                    Demo
                  </Link> */}
                  {/* <Link
                    to="/docs"
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
                  >
                    Docs
                  </Link> */}
                </div>

                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25 text-sm"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Mobile Menu */}
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-gray-700/50">
                  <div className="flex flex-col space-y-3">
                    {/* <Link
                      to="/features"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
                    >
                      Features
                    </Link> */}
                    {/* <Link
                      to="/demo"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
                    >
                      Demo
                    </Link> */}
                    {/* <Link
                      to="/docs"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium text-sm"
                    >
                      Docs
                    </Link> */}
                    <div className="flex flex-col space-y-2 pt-3 border-t border-gray-700/50">
                      <Link
                        to="/login"
                        className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-200 text-center text-sm"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Enhanced Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-6xl mx-auto text-center">
              <div
                className={`transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="mb-10">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm animate-pulse">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-400 animate-pulse" />
                    <span className="text-blue-300 font-medium text-sm">
                      AI-Powered Coding Platform
                    </span>
                    <div className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full text-xs font-bold text-white">
                      NEW
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shift">
                      Code
                    </span>
                    <span className="text-white drop-shadow-2xl">Buddy</span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Master algorithms, solve coding challenges, and accelerate
                    your programming journey with
                    <span className="text-transparent bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text font-semibold">
                      {" "}
                      AI-powered assistance
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link
                    to="/signup"
                    className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Coding Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  {/* <Link
                    to="/demo"
                    className="group inline-flex items-center px-8 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-blue-500/50 rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Try AI Chat
                    <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
                  </Link> */}
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <StatCard
                    icon={<Terminal className="w-8 h-8" />}
                    number="...."
                    label="Coding Problems"
                    description="Ready to solve"
                    color="blue"
                  />
                  <StatCard
                    icon={<Users className="w-8 h-8" />}
                    number="..."
                    label="Active Developers"
                    description="Learning together"
                    color="blue"
                  />
                  <StatCard
                    icon={<Brain className="w-8 h-8" />}
                    number="..."
                    label="AI Responses"
                    description="Smart hints given"
                    color="blue"
                  />
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-gray-400" />
            </div>
          </section>
          {/* Collaborative Editor Section */}
          <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-300 font-medium text-sm">
                    Collaborative Coding
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    Code Together, Instantly
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Join a room and start coding with others in real-time. Our
                  collaborative editor makes pair programming and team projects
                  seamless.
                </p>
                <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full mx-auto"></div>
              </div>

              <CollaborativeEditor />
            </div>
          </section>
          {/* Introduction Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-in-left" style={{ opacity: 0 }}>
                  <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                    <Rocket className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="text-blue-300 font-medium text-sm">
                      Introduction
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                    Transform Your Coding Journey with AI
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    CodeBuddy is more than just a coding platform. It's your
                    intelligent companion that understands your learning style,
                    adapts to your pace, and provides personalized guidance every
                    step of the way. Whether you're preparing for technical
                    interviews or mastering new algorithms, our AI-powered system
                    ensures you learn efficiently and effectively.
                  </p>
                  <div className="space-y-4">
                    <IntroPoint
                      icon={<Brain className="w-5 h-5 text-blue-400" />}
                      text="Intelligent problem recommendations based on your skill level"
                    />
                    <IntroPoint
                      icon={<Target className="w-5 h-5 text-blue-400" />}
                      text="Real-time feedback and hints to guide your learning"
                    />
                    <IntroPoint
                      icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                      text="Comprehensive progress tracking and skill assessment"
                    />
                  </div>
                </div>
                <div className="animate-slide-in-right" style={{ opacity: 0 }}>
                  <div className="relative">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm p-6 shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-400 text-sm font-mono">
                          CodeBuddy Terminal
                        </span>
                      </div>
                      <div className="font-mono text-sm space-y-2">
                        <div className="text-blue-400">$ codebuddy start</div>
                        <div className="text-gray-300">
                          🚀 Initializing AI assistant...
                        </div>
                        <div className="text-blue-400">
                          ✓ Loading problem set
                        </div>
                        <div className="text-blue-400">
                          ✓ Analyzing your progress
                        </div>
                        <div className="text-yellow-400">
                          ✓ Preparing personalized hints
                        </div>
                        <div className="text-blue-400">Ready to code! 💻</div>
                        <div className="text-gray-500 animate-pulse">|</div>
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Features Section */}
          <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                  <Star className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-300 font-medium text-sm">
                    Features
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    Why Choose CodeBuddy?
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Experience the next generation of coding education with
                  AI-powered features designed for modern developers
                </p>
                <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EnhancedFeatureCard
                  icon={<MessageSquare className="w-7 h-7" />}
                  title="AI Chat Assistant"
                  description="Get instant explanations, hints, and personalized feedback on your solutions with our advanced AI companion."
                  gradient="from-blue-600 to-blue-600"
                  bgGradient="from-blue-500/10 to-blue-500/10"
                  borderColor="border-blue-500/20"
                  delay="0"
                />
                <EnhancedFeatureCard
                  icon={<TrendingUp className="w-7 h-7" />}
                  title="Smart Progress Tracking"
                  description="Visualize your coding journey with detailed analytics, skill assessments, and personalized learning paths."
                  gradient="from-blue-600 to-cyan-600"
                  bgGradient="from-blue-500/10 to-cyan-500/10"
                  borderColor="border-blue-500/20"
                  delay="100"
                />
                <EnhancedFeatureCard
                  icon={<Zap className="w-7 h-7" />}
                  title="Lightning Fast Learning"
                  description="Accelerate your growth with AI-optimized problem recommendations and instant code execution."
                  gradient="from-yellow-600 to-orange-600"
                  bgGradient="from-yellow-500/10 to-orange-500/10"
                  borderColor="border-yellow-500/20"
                  delay="200"
                />
                <EnhancedFeatureCard
                  icon={<Users className="w-7 h-7" />}
                  title="Community Driven"
                  description="Connect with fellow developers, share solutions, and learn from the best coding practices."
                  gradient="from-blue-600 to-emerald-600"
                  bgGradient="from-blue-500/10 to-emerald-500/10"
                  borderColor="border-blue-500/20"
                  delay="300"
                />
                <EnhancedFeatureCard
                  icon={<Trophy className="w-7 h-7" />}
                  title="Competitive Coding"
                  description="Participate in contests, climb leaderboards, and showcase your skills to top tech companies."
                  gradient="from-red-600 to-pink-600"
                  bgGradient="from-red-500/10 to-pink-500/10"
                  borderColor="border-red-500/20"
                  delay="400"
                />
                <EnhancedFeatureCard
                  icon={<BookOpen className="w-7 h-7" />}
                  title="Comprehensive Learning"
                  description="Master data structures, algorithms, and system design with our structured curriculum."
                  gradient="from-indigo-600 to-blue-600"
                  bgGradient="from-indigo-500/10 to-blue-500/10"
                  borderColor="border-indigo-500/20"
                  delay="500"
                />
              </div>
            </div>
          </section>

          {/* Application Showcase Section */}
          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                  <Monitor className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-300 font-medium text-sm">
                    Application Features
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    Powerful Tools for Developers
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Discover the comprehensive suite of tools and features that
                  make CodeBuddy the ultimate coding companion
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <ApplicationFeature
                  icon={<Cpu className="w-8 h-8" />}
                  title="Real-time Code Execution"
                  description="Execute your code instantly with our cloud-based compiler supporting multiple programming languages."
                  features={[
                    "Multi-language support",
                    "Instant feedback",
                    "Memory optimization",
                    "Performance metrics",
                  ]}
                  gradient="from-blue-600 to-blue-600"
                />
                <ApplicationFeature
                  icon={<Database className="w-8 h-8" />}
                  title="Smart Problem Database"
                  description="Access thousands of carefully curated problems with intelligent difficulty progression and topic categorization."
                  features={[
                    "1500+ problems",
                    "Smart categorization",
                    "Difficulty progression",
                    "Topic-wise filtering",
                  ]}
                  gradient="from-blue-600 to-blue-600"
                />
                <ApplicationFeature
                  icon={<Shield className="w-8 h-8" />}
                  title="Secure Code Environment"
                  description="Code with confidence in our secure, sandboxed environment with advanced security measures."
                  features={[
                    "Sandboxed execution",
                    "Data protection",
                    "Secure authentication",
                    "Privacy controls",
                  ]}
                  gradient="from-red-600 to-blue-600"
                />
                <ApplicationFeature
                  icon={<Clock className="w-8 h-8" />}
                  title="Performance Analytics"
                  description="Track your coding performance with detailed analytics, time complexity analysis, and improvement suggestions."
                  features={[
                    "Time tracking",
                    "Complexity analysis",
                    "Performance insights",
                    "Progress reports",
                  ]}
                  gradient="from-yellow-600 to-red-600"
                />
              </div>
            </div>
          </section>

          {/* Enhanced AI Chat Showcase */}
          <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm p-8 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                      <Brain className="w-4 h-4 mr-2 text-blue-400" />
                      <span className="text-blue-300 font-medium text-sm">
                        AI-Powered
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                      Meet Your AI Coding Mentor
                    </h3>
                    <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                      Our advanced AI understands your code, identifies patterns,
                      and provides personalized guidance to help you become a
                      better programmer.
                    </p>
                    <div className="space-y-4">
                      <FeaturePoint
                        icon={<CheckCircle className="w-5 h-5 text-blue-400" />}
                        text="Real-time code analysis and suggestions"
                      />
                      <FeaturePoint
                        icon={<Target className="w-5 h-5 text-blue-400" />}
                        text="Personalized learning paths and recommendations"
                      />
                      <FeaturePoint
                        icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
                        text="Intelligent problem-solving hints"
                      />
                      <FeaturePoint
                        icon={<Award className="w-5 h-5 text-blue-400" />}
                        text="Code optimization and best practices"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <EnhancedAIChat />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Call to Action */}
          <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 via-blue-900/20 to-blue-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-600/10"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="mb-10">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-full mb-6 backdrop-blur-sm">
                  <Rocket className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-300 font-medium text-sm">
                    Ready to Start?
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  Level Up Your Coding Skills
                </h2>
                <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                  Join thousands of developers who are already improving their
                  skills with CodeBuddy's AI-powered platform. Start your journey
                  today and become the programmer you've always wanted to be.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                {/* <Link
                  to="/demo"
                  className="inline-flex items-center px-8 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-600/50 hover:border-blue-500/50 rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  Try Demo
                </Link> */}
              </div>
            </div>
          </section>

          {/* Enhanced Footer */}
          <footer className="bg-gray-900/80 border-t border-gray-700/50 py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                      CodeBuddy
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed max-w-md">
                    Your AI-powered coding companion. Empowering developers
                    worldwide to master algorithms and ace technical interviews.
                  </p>
                  <div className="flex space-x-3">
                    <SocialLink href="#" icon={<Github className="w-4 h-4" />} />
                    <SocialLink
                      href="#"
                      icon={<Twitter className="w-4 h-4" />}
                    />
                    <SocialLink
                      href="#"
                      icon={<Linkedin className="w-4 h-4" />}
                    />
                    <SocialLink href="#" icon={<Mail className="w-4 h-4" />} />
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <div className="space-y-2">
                    <FooterLink href="/features" text="Features" />
                    <FooterLink href="/demo" text="Demo" />
                    <FooterLink href="/docs" text="Documentation" />
                    <FooterLink href="/api" text="API" />
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-4">Company</h3>
                  <div className="space-y-2">
                    <FooterLink href="/blog" text="Blog" />
                    <FooterLink href="/careers" text="Careers" />
                    <FooterLink href="/support" text="Support" />
                    <FooterLink href="/community" text="Community" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700/50 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 mb-4 md:mb-0 text-sm">
                  &copy; {new Date().getFullYear()} CodeBuddy. All rights reserved.
                </p>
                <div className="flex space-x-4">
                  <FooterLink href="/privacy" text="Privacy Policy" />
                  <FooterLink href="/terms" text="Terms of Service" />
                  <FooterLink href="/cookies" text="Cookie Policy" />
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

// Enhanced Components
const StatCard = ({ icon, number, label, description, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-500/25",
    red: "from-blue-500 to-blue-600 shadow-blue-500/25",
    green: "from-blue-500 to-blue-600 shadow-blue-500/25",
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2 bg-gradient-to-r ${colorClasses[color]} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <span className="text-2xl md:text-3xl font-bold text-white">
          {number}
        </span>
      </div>
      <p className="text-gray-300 font-medium mb-1">{label}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

const EnhancedFeatureCard = ({
  icon,
  title,
  description,
  gradient,
  bgGradient,
  borderColor,
  delay,
}) => (
  <div
    className={`bg-gradient-to-r ${bgGradient} p-6 rounded-xl border ${borderColor} backdrop-blur-sm hover:scale-105 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-xl animate-fade-in-up`}
    style={{
      animationDelay: `${delay}ms`,
      animationFillMode: "forwards",
      opacity: 0,
    }}
  >
    <div className="mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        <div className="text-white">{icon}</div>
      </div>
    </div>
    <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const IntroPoint = ({ icon, text }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center border border-gray-600/30">
      {icon}
    </div>
    <span className="text-gray-300">{text}</span>
  </div>
);

const ApplicationFeature = ({ icon, title, description, features, gradient }) => (
  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-6 rounded-xl border border-gray-600/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group shadow-lg">
    <div className="flex items-center mb-4">
      <div
        className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
    <div className="grid grid-cols-2 gap-2">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-gray-400 text-sm">{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

const FeaturePoint = ({ icon, text }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-8 h-8 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-600/30">
      {icon}
    </div>
    <span className="text-gray-300">{text}</span>
  </div>
);

const EnhancedAIChat = () => (
  <div className="bg-gray-800/50 rounded-xl border border-gray-600/30 backdrop-blur-sm overflow-hidden shadow-xl">
    <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-600/30">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span className="text-gray-300 font-medium ml-3 text-sm">
          AI Coding Assistant
        </span>
      </div>
    </div>
    <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 max-w-xs border border-gray-600/30">
          <p className="text-gray-200 text-sm">
            I can help you optimize this algorithm! Try using a hash map for O(1)
            lookup time.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-3 justify-end">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg p-3 max-w-xs shadow-lg shadow-blue-500/25">
          <p className="text-white text-sm">
            Thanks! That reduced my time complexity significantly.
          </p>
        </div>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">U</span>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3 max-w-xs border border-gray-600/30">
          <p className="text-gray-200 text-sm">
            Great! Now let's work on the space complexity. Here's a more
            efficient approach...
          </p>
        </div>
      </div>
    </div>
  </div>
);

const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    className="w-8 h-8 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, text }) => (
  <Link
    to={href}
    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm"
  >
    {text}
  </Link>
);

const CreativeAnimatedBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-blue-900/10 to-blue-900/10"></div>
    <div className="absolute inset-0 opacity-20">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(147, 51, 234, 0.15) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>
    </div>

    {/* Enhanced Floating Code Snippets */}
    <div className="absolute top-16 left-8 opacity-30 animate-float">
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 backdrop-blur-sm shadow-xl">
        <div className="text-xs font-mono">
          <div className="text-blue-400">
            function binarySearch(arr, target) {"{"}
          </div>
          <div className="text-blue-400 ml-2">
            let left = 0, right = arr.length - 1;
          </div>
          <div className="text-blue-400 ml-2">while (left &lt;= right) {"{"}</div>
          <div className="text-yellow-400 ml-4">
            const mid = Math.floor((left + right) / 2);
          </div>
          <div className="text-pink-400 ml-4">
            if (arr[mid] === target) return mid;
          </div>
          <div className="text-cyan-400 ml-4">
            else if (arr[mid] &lt; target) left = mid + 1;
          </div>
          <div className="text-orange-400 ml-4">else right = mid - 1;</div>
          <div className="text-blue-400 ml-2">{"}"}</div>
          <div className="text-gray-400 ml-2">return -1;</div>
          <div className="text-blue-400">{"}"}</div>
        </div>
      </div>
    </div>

    <div className="absolute top-32 right-16 opacity-30 animate-float-delayed">
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 backdrop-blur-sm shadow-xl">
        <div className="text-xs font-mono">
          <div className="text-yellow-400">class TreeNode:</div>
          <div className="text-pink-400 ml-4">
            def __init__(self, val=0, left=None, right=None):
          </div>
          <div className="text-cyan-400 ml-8">self.val = val</div>
          <div className="text-cyan-400 ml-8">self.left = left</div>
          <div className="text-cyan-400 ml-8">self.right = right</div>
          <div className="text-blue-400 ml-0">def inorder_traversal(root):</div>
          <div className="text-blue-400 ml-4">if not root: return []</div>
          <div className="text-blue-400 ml-4">
            return (inorder_traversal(root.left) +
          </div>
          <div className="text-blue-400 ml-12">[root.val] +</div>
          <div className="text-blue-400 ml-12">
            inorder_traversal(root.right))
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-24 left-16 opacity-30 animate-float">
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 backdrop-blur-sm shadow-xl">
        <div className="text-xs font-mono">
          <div className="text-indigo-400">
            const quickSort = (arr) =&gt; {"{"}
          </div>
          <div className="text-blue-400 ml-2">
            if (arr.length &lt;= 1) return arr;
          </div>
          <div className="text-blue-400 ml-2">const pivot = arr[0];</div>
          <div className="text-blue-400 ml-2">
            const left = arr.slice(1).filter(x =&gt; x &lt; pivot);
          </div>
          <div className="text-yellow-400 ml-2">
            const right = arr.slice(1).filter(x =&gt; x &gt;= pivot);
          </div>
          <div className="text-pink-400 ml-2">
            return [...quickSort(left), pivot, ...quickSort(right)];
          </div>
          <div className="text-indigo-400">{"}"}</div>
        </div>
      </div>
    </div>

    <div className="absolute top-1/2 right-8 opacity-30 animate-float-delayed">
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 backdrop-blur-sm shadow-xl">
        <div className="text-xs font-mono">
          <div className="text-red-400">def fibonacci(n):</div>
          <div className="text-orange-400 ml-4">if n &lt;= 1: return n</div>
          <div className="text-yellow-400 ml-4">dp = [0] * (n + 1)</div>
          <div className="text-blue-400 ml-4">dp[1] = 1</div>
          <div className="text-blue-400 ml-4">for i in range(2, n + 1):</div>
          <div className="text-blue-400 ml-8">dp[i] = dp[i-1] + dp[i-2]</div>
          <div className="text-pink-400 ml-4">return dp[n]</div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-1/3 right-1/4 opacity-30 animate-float">
      <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/40 backdrop-blur-sm shadow-xl">
        <div className="text-xs font-mono">
          <div className="text-cyan-400">
            const mergeSort = (arr) =&gt; {"{"}
          </div>
          <div className="text-blue-400 ml-2">
            if (arr.length &lt;= 1) return arr;
          </div>
          <div className="text-blue-400 ml-2">
            const mid = Math.floor(arr.length / 2);
          </div>
          <div className="text-yellow-400 ml-2">
            const left = mergeSort(arr.slice(0, mid));
          </div>
          <div className="text-orange-400 ml-2">
            const right = mergeSort(arr.slice(mid));
          </div>
          <div className="text-red-400 ml-2">return merge(left, right);</div>
          <div className="text-cyan-400">{"}"}</div>
        </div>
      </div>
    </div>

    {/* Additional floating elements */}
    <div className="absolute top-1/3 right-12 opacity-20 animate-float">
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-full blur-xl"></div>
    </div>

    <div className="absolute bottom-1/4 left-1/3 opacity-20 animate-float-delayed">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-xl"></div>
    </div>

    <div className="absolute top-2/3 left-12 opacity-20 animate-float">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-full blur-xl"></div>
    </div>
  </div>
);

// New Collaborative Editor Component
const CollaborativeEditor = () => {
  const [code, setCode] = useState(
    `function collaborativeFunction() {\n  // Start coding together!\n}`
  );
  const [messages, setMessages] = useState([
    {
      user: "Alice",
      text: "Hey everyone, let's start with the main function.",
    },
    { user: "Bob", text: "Sounds good! I'll add the initial setup." },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([
    { name: "Alice", avatar: "A" },
    { name: "Bob", avatar: "B" },
    { name: "You", avatar: "Y" },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm p-4 sm:p-6 shadow-2xl flex flex-col lg:flex-row gap-6">
      {/* Code Editor */}
      <div className="flex-grow lg:w-2/3">
        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800/60 rounded-t-xl border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm font-mono">
              /room-123/main.js
            </span>
            <div className="flex items-center space-x-2">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="w-7 h-7 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-gray-700"
                  title={user.name}
                >
                  {user.avatar}
                </div>
              ))}
            </div>
          </div>
          <textarea
            className="w-full flex-grow p-4 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={20}
          />
        </div>
      </div>

      {/* Chat & Participants */}
      <div className="flex-shrink-0 lg:w-1/3">
        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 h-full flex flex-col">
          <div className="px-4 py-3 bg-gray-800/60 rounded-t-xl border-b border-gray-700/50">
            <h3 className="text-white font-semibold">
              <MessageSquare className="w-5 h-5 inline-block mr-2" />
              Team Chat
            </h3>
          </div>
          <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.user === "You" ? "justify-end" : ""
                }`}
              >
                {msg.user !== "You" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-xs font-bold">
                      {msg.user.charAt(0)}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-xs ${
                    msg.user === "You"
                      ? "bg-gradient-to-r from-blue-600 to-blue-600 shadow-lg shadow-blue-500/25"
                      : "bg-gray-700/50 border border-gray-600/30"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      msg.user === "You" ? "text-white" : "text-gray-200"
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
                {msg.user === "You" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-gray-700/50 flex items-center gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 rounded-lg text-white transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;