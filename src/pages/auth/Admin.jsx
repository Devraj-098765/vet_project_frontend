
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ErrorMessage from "../../utils/ErrorMessage";
import { Loader } from "../../utils/Loading";
import useAdminLogin from "../../hooks/useAdminLogin";
import AuthLayout from "../../utils/AuthLayout";

const schema = z.object({
  role: z.enum(["admin", "vetnerian"], { message: "Select a valid role" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 3 characters" }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "",
      email: "",
      password: "",
    },
  });

  const { handleAdminLogin, loading, error } = useAdminLogin();

  const onSubmit = async (data) => {
    await handleAdminLogin(data);
  };

  return (
    <AuthLayout title="Login">
     
      <div className="overflow-hidden rounded-2xl shadow-xl w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative">
          <div className="absolute left-0 right-0 bottom-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-16 -mb-1">
              <path fill="#ffffff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
          <p className="text-blue-100 text-center mt-1">Sign in to access your account</p>
        </div>
        
        <div className="bg-white p-6">
          <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Your Role</label>
              <div className="relative">
                <select
                  {...register("role")}
                  id="role"
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-800"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="vetnerian">Veterinarian</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {errors.role && <ErrorMessage>{errors.role.message}</ErrorMessage>}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-800"
                />
              </div>
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <ErrorMessage>{error}</ErrorMessage>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <Loader />
                ) : (
                  <span className="flex items-center">
                    <span>Sign In</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;