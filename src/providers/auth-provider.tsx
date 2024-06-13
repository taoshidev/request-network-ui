"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signout, getAuthUser } from "@/actions/auth";
import { UserType } from "@/db/types/user";

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await getAuthUser();
      if (!authenticatedUser) {
        router.push("/login");
      } else {
        setUser(authenticatedUser as UserType);
      }
      setLoading(false);
    };

    fetchUser();

    const interval = setInterval(async () => {
      const authenticatedUser = await getAuthUser();
      if (!authenticatedUser) {
        router.push("/login");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const setAuthUser = (user) => {
    setUser(user);
  };

  const logout = async () => {
    setLoading(true);
    await signout();
    setUser(null);
    setLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
