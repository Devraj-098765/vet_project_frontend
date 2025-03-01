import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import ErrorMessage from "../../utils/ErrorMessage";
import { Loader } from "../../utils/Loading";
import useLogin from "../../hooks/useLogin";
import AuthLayout from "../../utils/AuthLayout"
import { zodResolver } from "@hookform/resolvers/zod";
import useAdminLogin from "../../hooks/useAdminLogin";

// Define the schema using Zod
const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

const Admin = () => {
  const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
  })

  const { handleAdminLogin, loading, error } = useAdminLogin();

  const onSubmit = async () => {
    handleAdminLogin({
      email: import.meta.env.VITE_ADMIN_EMAIL,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });
  };

  return (
    <AuthLayout title={"Login"}>
        <section>
            <form
            className="w-[396px]"
            onSubmit={handleSubmit(onSubmit)}
            >

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

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-3 mt-6">
                <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
                >
                {loading ? <Loader /> : "LogIn with Email"}
                </button>
            </div>
            </form>
        </section>
    </AuthLayout>
  
  )
}

export default Admin;
