"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import ClientRedirect from "@/components/ClientRedirect";

const withAuthGuard = (WrappedComponent) => {
  const WithAuthGuard = (props: JSX.IntrinsicAttributes) => {
    const { user, loading } = useAuth();
    const [redirect, setRedirect] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        setRedirect("/login");
        return;
      }
    }, [user, loading, router]);

    if (redirect) {
      const delay = redirect ? 5000 : 0;

      return (
        <ClientRedirect
          href={redirect}
          message={"Session expired..."}
          delay={delay}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthGuard.displayName = `WithAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthGuard;
};

export default withAuthGuard;
