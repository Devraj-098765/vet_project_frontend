import AuthLayout from "../../utils/AuthLayout"
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import ErrorMessage from "../../utils/ErrorMessage";
import { Loader } from "../../utils/Loading";
import useSignup from "../../hooks/useSignup";
import { zodResolver } from "@hookform/resolvers/zod";


const schema = z
  .object({
    name: z
      .string({ invalid_type_error: "Name is required" })
      .min(3, { message: "Must be 3 or more characters long" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be 6 characters long" }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { handleAuthSignup, loading, error } = useSignup();

  const onSubmit = (data) => {
    handleAuthSignup({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <AuthLayout title={"Sign in"}>
        <section>
            <form
            className="w-[396px]"
            onSubmit={handleSubmit(onSubmit)}
            >

        <div className="mb-3">
          <label htmlFor="name">Full Name</label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              {...register("email")}
              type="text"
              id="email"
              className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
                />
                {errors.password && (
                <ErrorMessage>{errors.password.message}</ErrorMessage>
                )}
            </div>

            
        <div className="mb-3">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            {...register("confirm")}
            type="password"
            id="confirm"
            className="w-full px-3 py-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.confirm && (
            <ErrorMessage>{errors.confirm.message}</ErrorMessage>
          )}
        </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-3 mt-6">
                <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
                >
                {loading ? <Loader /> : "SignIn with Email"}
                </button>

                <h3 className="text-center text-base">or</h3>

                <p className="text-sm text-black text-center">
                 Or Have An Account Already ?{" "}
                 <NavLink to="/login">Click Here</NavLink>
                </p>
            </div>
            </form>
        </section>
    </AuthLayout>
  
  )
}

export default Signup
