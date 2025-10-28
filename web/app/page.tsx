"use client";
import React from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data, status } = useSession();
  const user = data?.user as any;
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900 mx-auto"></div>
          <p className="mt-4 text-primary-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gold-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <Image
              src="/shrimperstrust.gif"
              alt="Shrimpers Trust logo"
              width={240}
              height={50}
              priority
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary-900 mb-6">
            Welcome to Shrimpers Trust Tools
          </h1>
          <p className="text-xl text-primary-700 max-w-2xl mx-auto">
            Your comprehensive platform for managing and accessing Shrimpers
            Trust resources
          </p>
        </div>

        {user ? (
          <div className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">
                Welcome back, {user.name}!
              </h2>
              <p className="text-primary-700">
                Access your tools and resources below.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card hover:border-gold-200">
                <h3 className="text-xl font-semibold text-primary-900 mb-3">
                  Tools
                </h3>
                <p className="text-primary-700 mb-4">
                  Access various administrative and utility tools.
                </p>
                <Link href="/tools/passwordreset">
                  <button className="bg-primary-900 text-gold-400 px-4 py-2 rounded-md hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200">
                    Reset Password Email
                  </button>
                </Link>
              </div>

              <div className="card hover:border-gold-200">
                <h3 className="text-xl font-semibold text-primary-900 mb-3">
                  Finance
                </h3>
                <p className="text-primary-700 mb-4">
                  Financial reporting and management tools.
                </p>
                <Link href="/finance/monthly-report">
                  <button className="bg-primary-900 text-gold-400 px-4 py-2 rounded-md hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Monthly Report
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center">
            <div className="card">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">
                Get Started
              </h2>
              <p className="text-primary-700 mb-6">
                Sign in to access your Shrimpers Trust tools and resources.
              </p>
              <button onClick={() => signIn()} className="w-full bg-primary-900 text-gold-400 px-6 py-3 rounded-md font-medium hover:bg-primary-800 hover:text-gold-300 transition-colors duration-200">
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
