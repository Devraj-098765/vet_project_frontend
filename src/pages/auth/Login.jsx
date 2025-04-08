import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import ErrorMessage from "../../utils/ErrorMessage";
import { Loader } from "../../utils/Loading";
import useLogin from "../../hooks/useLogin";
import AuthLayout from "../../utils/AuthLayout"
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema using Zod
const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

const Login = () => {
  const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
  })

  const { handleAuthLogin, loading, error } = useLogin();

  const onSubmit = async (data) => {
    handleAuthLogin({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <AuthLayout title={"Login"}>
        <section className="flex justify-center items-center">
            <form
            className="w-[396px] bg-gradient-to-br from-violet-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-violet-100"
            onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-violet-800 mb-2">Welcome Back</h2>
                <p className="text-slate-600 text-sm">Enter your credentials to access your account</p>
              </div>

              <div className="mb-5 relative">
                <label htmlFor="email" className="block text-sm font-medium text-violet-700 mb-1 ml-1">Email</label>
                <div className="relative">
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white shadow-sm"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </div>

              <div className="mb-5 relative">
                <label htmlFor="password" className="block text-sm font-medium text-violet-700 mb-1 ml-1">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white shadow-sm"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
              </div>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <div className="flex flex-col gap-4 mt-8">
                <button
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md transform transition-transform duration-200 hover:scale-[1.02] disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? <Loader /> : (
                    <>
                      <span>LogIn with Email</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-violet-200"></div>
                  <span className="flex-shrink mx-4 text-violet-400 text-sm font-medium">or</span>
                  <div className="flex-grow border-t border-violet-200"></div>
                </div>

                <p className="text-sm text-slate-600 text-center">
                  Don't Have An Account Yet?{" "}
                  <NavLink to="/sign-up" className="text-violet-600 font-medium hover:text-violet-800 transition-colors">Create Account</NavLink>
                </p>
              </div>
            </form>
        </section>
    </AuthLayout>
  )
}

export default Login