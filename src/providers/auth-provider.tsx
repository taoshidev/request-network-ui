"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { signout, getAuthUser } from "@/actions/auth";
import { UserType } from "@/db/types/user";
import ClientRedirect from "@/components/ClientRedirect";
import { setUser as setSentryUser, setTag } from "@sentry/nextjs";

type AuthContextValue = {
  user: UserType | null;
  setAuthUser: (user: UserType) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setAuthUser: () => {},
  logout: () => {},
  loading: true,
});

type RedirectParamType = {
  path: string;
  message: string;
  delay?: number;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState<RedirectParamType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await getAuthUser();
      if (!authenticatedUser) {
        setRedirect({ path: "/login", message: "Auth Session expired..." });
      } else {
        setUser(authenticatedUser as UserType);
      }
      setLoading(false);
    };

    fetchUser();

    const interval = setInterval(async () => {
      const authenticatedUser = await getAuthUser();
      if (!authenticatedUser) {
        setRedirect({ path: "/login", message: "Auth Session expired..." });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateSentryUser = (user: UserType | null) => {
    if (
      ["production", "staging"].includes(
        process.env.NEXT_PUBLIC_NODE_ENV as string
      )
    ) {
      setSentryUser({
        id: user?.id || undefined,
        email: user?.email || undefined,
      });
      setTag("ID", user?.id || undefined);
      setTag("Role", user?.user_metadata?.role || undefined);
    }
  };

  useEffect(() => {
    updateSentryUser(user);
  }, [user]);

  const setAuthUser = (user) => {
    setUser(user);
  };

  if (loading || redirect) {
    return (
      <ClientRedirect
        href={redirect?.path!}
        message={redirect?.message}
        delay={redirect?.delay || 3500}
      />
    );
  }

  const logout = async () => {
    setLoading(true);
    await signout();
    setRedirect({ path: "/login", message: "Logging out...", delay: 3000 });
    setUser(null);
    updateSentryUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
