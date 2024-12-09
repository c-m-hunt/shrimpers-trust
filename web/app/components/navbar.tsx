"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Navbar() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-white font-bold mr-4">
            Shrimpers Trust Tools
          </Link>
          <div className="text-white">{user ? user.name : "Not logged in"}</div>
        </div>
        <ul className="flex ml-auto space-x-4">
          <li>
            <Link href="/" className="text-white">
              Home
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link href="/tools/passwordreset" className="text-white">
                  Password Reset
                </Link>
              </li>
              <li>
                <a href="/api/auth/logout" className="text-white">
                  Logout
                </a>
              </li>
            </>
          )}
          {!user && (
            <li>
              <a href="/api/auth/login" className="text-white">
                Login
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
