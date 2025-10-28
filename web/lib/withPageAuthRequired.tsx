"use client";
import React from "react";
import { useSession, signIn } from "next-auth/react";

export function withPageAuthRequired<P>(Component: React.ComponentType<P>) {
  function Wrapped(props: P) {
    const { status } = useSession();

    React.useEffect(() => {
      if (status === "unauthenticated") {
        // Redirect to sign in; NextAuth will handle callback back to the current page
        signIn(undefined, { callbackUrl: window.location.href });
      }
    }, [status]);

    if (status === "loading") return null;
    if (status === "unauthenticated") return null;

    return <Component {...props} />;
  }
  return Wrapped;
}
