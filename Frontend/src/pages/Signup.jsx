/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../features/auth/authSlice";
import { useSpring, animated } from "@react-spring/web";
import { EyeOff, Eye } from "lucide-react";
const SignUp = () => {
  const signupSchema = z.object({
    firstName: z.string().min(3, "Name should contain at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password is too weak "),
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


  // already authenticated redirect yourself to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };
  const animationProps = useSpring({
    from: { opacity: 0, transform: "translateY(60px) scale(0.95)" },
    to: { opacity: 1, transform: "translateY(0) scale(1 )" },
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
            Create a new account to get started!
          </p>
        </div>

        <animated.form
          style={animationProps}
          onSubmit={handleSubmit(onSubmit)}
          className="card bg-base-100 shadow-xl p-8 space-y-4"
        >
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              {...register("firstName")}
              placeholder="Enter your first name"
              className="input input-bordered w-full"
            />
            {errors.firstName && (
              <p className="mt-1 text-error text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email")}
              placeholder="Enter your email"
              type="email"
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="mt-1 text-error text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
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
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </div>

          {/* {error && (
            <div className="alert alert-error mt-2 p-2 text-sm">{error}</div>
          )} */}
          <div className="text-center pt-4">
            <p className="text-sm text-base-content/70">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary font-medium hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </animated.form>
      </div>
    </div>
  );
};

export default SignUp;
