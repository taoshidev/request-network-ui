"use client";

import { RegistrationProvider } from "@/providers/registration";

export default function Layout({ children }: any) {
  return <RegistrationProvider>{children}</RegistrationProvider>;
}
