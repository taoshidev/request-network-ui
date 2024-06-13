"use client";

import { JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import Loading from "@/app/(auth)/loading";

const withAuthGuard = (WrappedComponent) => {
  const WithAuthGuard = (props: JSX.IntrinsicAttributes) => {
    const { user, loading } = useAuth();

    const router = useRouter();

    useEffect(() => {
      console.log("from withAuthGuard", user, "loading:::", loading);
      if (!loading && !user) {
        console.log("from withAuthGuard redirecting to login...");
        router.push("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      console.log("from auth guard loading...");
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthGuard.displayName = `WithAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthGuard;
};

export default withAuthGuard;
