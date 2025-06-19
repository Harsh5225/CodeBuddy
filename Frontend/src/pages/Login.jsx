/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loginUser } from "../features/auth/authSlice";
import { useSpring, animated } from "@react-spring/web";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password is too weak "),
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
    console.log(data)
    dispatch(loginUser(data));
  };

  // Animation: slide up 60px + scale up from 0.95 to 1 + fade in opacity
  const animationProps = useSpring({
    from: { opacity: 0, transform: "translateY(60px) scale(0.95)" },
    to: { opacity: 1, transform: "translateY(0) scale(1.0 )" },
    config: { tension: 250, friction: 20 },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-base-200"
      data-theme="dark"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Leetcode</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Welcome back! Please login to continue.
          </p>
        </div>
        <animated.form
          style={animationProps}
          onSubmit={handleSubmit(onSubmit)}
          className="card bg-base-100 shadow-xl p-8 space-y-4"
        >
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="mt-1 text-error text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full"
            />
            {errors.password && (
              <p className="mt-1 text-error text-sm">
                {errors.password.message}
              </p>
            )}
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer z-10"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="text-center pt-4">
            <p className="text-sm text-base-content/70">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary font-medium hover:underline"
              >
                Signup
              </button>
            </p>
          </div>
        </animated.form>
      </div>
    </div>
  );
};

export default Login;
