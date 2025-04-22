import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useLogin from '../../hooks/useLogin';
import ErrorMessage from '../../utils/ErrorMessage';
import { Loader } from '../../utils/Loading';
import AuthLayout from '../../utils/AuthLayout';

// Define the schema using Zod with password validation
const schema = z.object({
  newPassword: z.string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordConfirmation = () => {
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  
  // Get token from URL params
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Get login hook functions and state
  const { handleResetPassword, loading, error, validateResetToken } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Validate token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      // Basic validation - check if token exists
      if (!token) {
        setTokenError("Invalid or missing reset token");
        setValidatingToken(false);
        return;
      }

      try {
        // Call the validateResetToken function from your hook
        const isValid = await validateResetToken(token);
        setTokenValid(isValid);
      } catch (err) {
        setTokenError("Error validating reset token");
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    // Call the reset password function from your hook
    await handleResetPassword(token, data.newPassword);
  };

  // Show loading state while validating token
  if (validatingToken) {
    return (
      <AuthLayout title="Reset Password">
        <section className="flex justify-center items-center">
          <div className="w-[396px] bg-gradient-to-br from-violet-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-violet-100 text-center">
            <div className="flex justify-center mb-4">
              <Loader />
            </div>
            <h2 className="text-xl font-medium text-violet-800">Validating your reset link...</h2>
          </div>
        </section>
      </AuthLayout>
    );
  }

  // Show error if token is invalid
  if (!tokenValid && tokenError) {
    return (
      <AuthLayout title="Reset Password">
        <section className="flex justify-center items-center">
          <div className="w-[396px] bg-gradient-to-br from-violet-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-violet-100 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-violet-800 mb-2">Invalid Link</h2>
            <p className="text-slate-600 mb-6">
              {tokenError || "This password reset link is invalid or has expired. Please request a new one."}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md"
            >
              Return to Login
            </button>
          </div>
        </section>
      </AuthLayout>
    );
  }

  // Show password reset form if token is valid
  return (
    <AuthLayout title="Reset Password">
      <section className="flex justify-center items-center">
        <form
          className="w-[396px] bg-gradient-to-br from-violet-50 to-slate-100 p-8 rounded-2xl shadow-lg border border-violet-100"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-violet-800 mb-2">Create New Password</h2>
            <p className="text-slate-600 text-sm">
              Your password must be at least 8 characters and include uppercase, lowercase, and numbers
            </p>
          </div>

          <div className="mb-5 relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-violet-700 mb-1 ml-1">
              New Password
            </label>
            <div className="relative">
              <input
                {...register("newPassword")}
                type="password"
                id="newPassword"
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white shadow-sm"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}
          </div>

          <div className="mb-5 relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-violet-700 mb-1 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white shadow-sm"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div className="flex flex-col gap-4 mt-8">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 shadow-md transform transition-transform duration-200 hover:scale-105 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  <span>Reset Password</span>
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
          </div>
        </form>
      </section>
    </AuthLayout>
  );
};

export default ResetPasswordConfirmation;