/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "./features/auth/authSlice";
import { useEffect } from "react";
const SignUp = () => {
  const signupSchema = z.object({
    firstname: z.string().min(3, "name should contain atleast 3 characters"),
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
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // if user is already authenticated move to home page
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <>
      <div
        className="min-h-screen flex  flex-col items-center justify-center"
        data-theme="dark"
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 text-center relative inline-block">
          Leetcode
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-8 bg-base-100 rounded-lg shadow-md w-full max-w-md"
        >
          <input
            {...register("firstName")}
            placeholder="firstname"
            className="input input-bordered w-full"
          />
          {errors.firstname && (
            <span className="alert alert-error py-1 px-2 text-sm">
              {errors.firstname.message}
            </span>
          )}
          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="input input-bordered w-full"
          />
          {errors.email && (
            <span className="alert alert-error py-1 px-2 text-sm">
              {errors.email.message}
            </span>
          )}
          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="input input-bordered w-full"
          />
          {errors.password && (
            <span className="alert alert-error py-1 px-2 text-sm">
              {errors.password.message}
            </span>
          )}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUp;
