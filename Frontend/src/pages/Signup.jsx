"use client";

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../features/auth/authSlice";
import { useSpring, animated } from "@react-spring/web";
import {
  Eye,
  EyeOff,
  Code,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  Rocket,
  CheckCircle,
  Cpu,
  BarChart,
} from "lucide-react";

const SignUp = () => {
  const signupSchema = z.object({
    firstName: z.string().min(3, "Name should contain at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password is too weak"),
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const containerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(80px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0) scale(1.0)" },
    config: { tension: 200, friction: 25 },
  });

  const logoAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-50px) rotate(-30deg)" },
    to: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    delay: 100,
    config: { tension: 180, friction: 12 },
  });

  const formAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 400,
    config: { tension: 160, friction: 14 },
  });

  const heroAnimation = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    delay: 300,
    config: { tension: 150, friction: 18 },
  });

  const benefits = [
    "1000+ coding challenges",
    "Real-time code execution",
    "Detailed solution explanations",
  ];

  const benefitAnimations = benefits.map((_, index) => ({
    opacity: 0,
    transform: "translateX(-30px)",
    delay: 1200 + index * 100,
    config: { tension: 180, friction: 15 },
  }));

  const [benefitAnimationStyles, setBenefitAnimationStyles] = useState(
    benefitAnimations.map(() => ({
      opacity: 0,
      transform: "translateX(-30px)",
    }))
  );

  useEffect(() => {
    benefitAnimations.forEach((animation, index) => {
      setTimeout(() => {
        setBenefitAnimationStyles((prevStyles) => {
          const newStyles = [...prevStyles];
          newStyles[index] = { opacity: 1, transform: "translateX(0)" };
          return newStyles;
        });
      }, animation.delay);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/8 to-blue-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>

      <animated.div
        style={containerAnimation}
        className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start relative z-10"
      >

        <div className="mt-40 space-y-10">
          <animated.div style={logoAnimation}>
            <div className="flex items-center mt-[-4rem] space-x-4 mb-10">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  CodeBuddy
                </h1>
                <p className="text-gray-400 text-base font-medium">
                  Master Your Coding Skills
                </p>
              </div>
            </div>
          </animated.div>

          <animated.div style={heroAnimation}>
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-white leading-tight">
                  Start your
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block">
                    coding adventure
                  </span>
                  <span className="text-3xl block mt-2 text-gray-300">
                    today! 🚀
                  </span>
                </h2>
                <p className="text-gray-300 text-xl leading-relaxed">
                  Join thousands of developers who are already improving their
                  skills and landing dream jobs with our comprehensive platform.
                </p>
              </div>

              {/* <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <animated.div
                    key={index}
                    style={benefitAnimationStyles[index]}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300 font-medium">{benefit}</span>
                  </animated.div>
                ))}
              </div> */}
            </div>
          </animated.div>

          {/* <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-gray-400 text-sm">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
          </div> */}
        </div>

        <div className="w-full flex flex-col justify-center pt-16 lg:pt-20">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodeBuddy
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Join the coding revolution! 🚀
            </p>
          </div>

          <div className="w-full max-w-md mx-auto mb-10">
            <animated.div
              style={formAnimation}
              className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="hidden lg:block text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Create Account
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Start your coding journey today
                  </p>
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-400 text-sm ml-2">
                      Trusted by developers
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        {...register("firstName")}
                        type="text"
                        placeholder="Enter your first name"
                        className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    {errors.firstName && (
                      <p className="text-red-400 text-sm flex items-center mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm flex items-center mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm flex items-center mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl relative overflow-hidden ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 hover:shadow-purple-500/25"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-lg">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span className="text-lg">Start Coding Journey</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-6 border-t border-gray-600/40">
                    <p className="text-gray-400">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </animated.div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-3 text-gray-400 text-sm bg-gray-800/30 px-6 py-3 rounded-full border border-gray-600/30 backdrop-blur-sm">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <span>Powered by AI</span>
                <BarChart className="w-5 h-5 text-rose-400" />
                <span>Privacy-first analytics</span>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default SignUp;
