import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const Login = () => {
  const signupSchema = z.object({
    firstname: z.string().min(3, "name should contain atleast 3 characters"),
    emailId: z.string().email("Invalid email"),
    password: z.string().min(8, "Password is too weak "),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) }); 

  const onSubmit = (data) => console.log(data);
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      data-theme="dark"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-8 bg-base-100 rounded-lg shadow-md w-full max-w-md"
      >
        <input
          {...register("firstname")}
          placeholder="firstname"
          className="input input-bordered w-full"
        />
        {errors.firstName && <span>{errors.firstname.message}</span>}
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
          className="input input-bordered w-full"
        />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
