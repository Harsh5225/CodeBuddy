/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser } from "../features/auth/authSlice";
import { useSpring, animated } from "@react-spring/web";
import {
  Eye,
  EyeOff,
  Code,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  Trophy,
  Star,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password is too weak"),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    console.log(data);
    dispatch(loginUser(data));
  };

  // Animations remain the same
  const containerAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(80px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0) scale(1.0)" },
    config: { tension: 200, friction: 25 },
  });

  const logoAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-40px) rotate(-5deg)" },
    to: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
    delay: 200,
    config: { tension: 180, friction: 15 },
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
    delay: 600,
    config: { tension: 150, friction: 18 },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Main container with reduced max-width and gap for a more compact layout */}
      <animated.div
        style={containerAnimation}
        className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left Side - Made more compact */}
        {/* Further reduced vertical spacing to space-y-8 */}
        <div className="hidden lg:block space-y-8">
          <animated.div style={logoAnimation}>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  CodeBuddy
                </h1>
                <p className="text-gray-400 text-base font-medium">
                  Master Your Coding Skills
                </p>
              </div>
            </div>
          </animated.div>

          <animated.div style={heroAnimation}>
            <div className="space-y-6">
              {/* Reduced font size from 5xl to 4xl and 3xl to 2xl on large screens */}
              <h2 className="text-4xl lg:text-4xl font-bold text-white leading-tight">
                Welcome back to your
                <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block">
                  coding journey
                </span>
                <span className="text-2xl lg:text-2xl block mt-2 text-gray-300">
                  Let's continue! 🚀
                </span>
              </h2>
              {/* Reduced font size from xl to lg on large screens */}
              <p className="text-lg lg:text-lg text-gray-300 leading-relaxed">
                Continue solving challenging problems, track your progress, and
                become a better programmer.
              </p>
            </div>
          </animated.div>

          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-800/40 to-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-white">BEGIN</div>
              <div className="text-gray-400 text-sm">Set Your Vision</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">BUILD</div>
              <div className="text-gray-400 text-sm">Stay Consistent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">BREAKTHROUGH</div>
              <div className="text-gray-400 text-sm">Achieve Excellence</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                  CodeBuddy
                </h1>
              </div>
              <p className="text-gray-400 text-lg">
                Welcome back! Ready to code? 🚀
              </p>
            </div>

            {/* Form card padding reduced from p-8 to p-6 */}
            <animated.div
              style={formAnimation}
              className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-3xl border border-gray-600/40 p-6 shadow-2xl relative"
            >
              <div className="relative z-10">
                <div className="hidden lg:block text-center mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400">
                    Sign in to continue your journey
                  </p>
                </div>

                {/* Form element spacing reduced from space-y-6 to space-y-4 */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Email Field */}
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
                        className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm flex items-center mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full bg-gray-700/60 border border-gray-600/60 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm flex items-center mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }`}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Target className="w-5 h-5" />
                        <span>Continue Journey</span>
                      </>
                    )}
                  </button>

                  {/* Signup Link */}
                  <div className="text-center pt-4 border-t border-gray-600/40">
                    <p className="text-gray-400">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </animated.div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default Login;