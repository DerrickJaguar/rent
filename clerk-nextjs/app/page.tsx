"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function AuthPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
          Rent Management System
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          {showSignUp
            ? "Create an account or use a social login"
            : "Sign in to manage tenants, properties, and payments"}
        </p>

        {/* Toggle Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowSignUp(!showSignUp)}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            {showSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Clerk Components */}
        {showSignUp ? (
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/"
            appearance={{
              elements: {
                card: "rounded-xl shadow-xl p-6",
                socialButtons: "mb-4",
              },
            }}
          />
        ) : (
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/"
            appearance={{
              elements: {
                card: "rounded-xl shadow-xl p-6",
                socialButtons: "mb-4",
              },
            }}
          />
        )}

        {/* Password recovery link (built into SignIn component) */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Forgot your password? Click "Reset password" on the sign-in form.
        </p>
      </div>
    </div>
  );
}