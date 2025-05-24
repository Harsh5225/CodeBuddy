import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import GlitchText from "./Glitch";
const Login = () => {
  const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password is too weak "),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data) => console.log(data);
  return (
    <>
      <div
        className="min-h-screen flex  flex-col items-center justify-center"
        data-theme="dark"
      >
        Leetcode
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-8 bg-base-100 rounded-lg shadow-md w-full max-w-md"
        >
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

export default Login;
