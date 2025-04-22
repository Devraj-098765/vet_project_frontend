import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { z } from "zod";
import ErrorMessage from "../../utils/ErrorMessage";
import { Loader } from "../../utils/Loading";
import useLogin from "../../hooks/useLogin";
import AuthLayout from "../../utils/AuthLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// Define schemas using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const resetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const Login = () => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Login form handling
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Reset password form handling
  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const { handleAuthLogin, loading, error, handleForgetPassword, handleResetPassword} = useLogin();

  const onLoginSubmit = async (data) => {
    handleAuthLogin({
      email: data.email,
      password: data.password,
    });
  };

  const onResetSubmit = async (data) => {
    setResetLoading(true);
    setResetError(null);
    
    try {
      // Simulate API call to send reset link
      await handleForgetPassword(data.email);
      setResetSuccess(true);
    } catch (err) {
      setResetError("Failed to send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsResetMode(true);
    setResetSuccess(false);
  };

  const handleBackToLogin = () => {
    setIsResetMode(false);
    setResetSuccess(false);
  };

  return (
    <AuthLayout title={isResetMode ? "Reset Password" : "Login"}>
      <section className="flex justify-center items-center">
        {!isResetMode ? (
          // Login Form
          <form
            className="w-[396px] bg-gradient-to-br from-violet-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-violet-100"
            onSubmit={handleLoginSubmit(onLoginSubmit)}
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-violet-800 mb-2">Welcome Back</h2>
              <p className="text-slate-600 text-sm">Enter your credentials to access your account</p>
            </div>

            <div className="mb-5 relative">
              <label htmlFor="email" className="block text-sm font-medium text-violet-700 mb-1 ml-1">Email</label>
              <div className="relative">
                <input
                  {...loginRegister("email")}
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
              {loginErrors.email && <ErrorMessage>{loginErrors.email.message}</ErrorMessage>}
            </div>

            <div className="mb-2 relative">
              <label htmlFor="password" className="block text-sm font-medium text-violet-700 mb-1 ml-1">Password</label>
              <div className="relative">
                <input
                  {...loginRegister("password")}
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
              {loginErrors.password && <ErrorMessage>{loginErrors.password.message}</ErrorMessage>}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-3">
              <button 
                onClick={handleForgotPassword} 
                className="text-sm text-violet-600 hover:text-violet-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-4 mt-8">
              <button
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md transform transition-transform duration-200 hover:scale-105 disabled:opacity-70"
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
        ) : (
          // Password Reset Form
          <div className="w-[396px] bg-gradient-to-br from-violet-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-violet-100">
            {!resetSuccess ? (
              <form onSubmit={handleResetSubmit(onResetSubmit)}>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-violet-800 mb-2">Reset Password</h2>
                  <p className="text-slate-600 text-sm">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </div>

                <div className="mb-5 relative">
                  <label htmlFor="reset-email" className="block text-sm font-medium text-violet-700 mb-1 ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      {...resetRegister("email")}
                      type="text"
                      id="reset-email"
                      className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white shadow-sm"
                      placeholder="you@example.com"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-violet-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                  {resetErrors.email && <ErrorMessage>{resetErrors.email.message}</ErrorMessage>}
                </div>

                {resetError && <ErrorMessage>{resetError}</ErrorMessage>}

                <div className="flex flex-col gap-4 mt-8">
                  <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md transform transition-transform duration-200 hover:scale-105 disabled:opacity-70"
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <Loader />
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="flex items-center my-2">
                    <div className="flex-grow border-t border-violet-200"></div>
                    <span className="flex-shrink mx-4 text-violet-400 text-sm font-medium">or</span>
                    <div className="flex-grow border-t border-violet-200"></div>
                  </div>

                  <button
                    onClick={handleBackToLogin}
                    className="text-violet-600 font-medium hover:text-violet-800 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              // Success message after sending reset link
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-violet-800 mb-2">Check Your Email</h2>
                <p className="text-slate-600 mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>
                <button
                  onClick={handleBackToLogin}
                  className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </AuthLayout>
  );
};

export default Login;