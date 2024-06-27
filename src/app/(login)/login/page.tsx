import { Suspense } from "react";
import { getAuthUser } from "@/actions/auth";
import { Login } from "@/components/Login";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getAuthUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
