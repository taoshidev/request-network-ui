import ClientLayout from "./client-layout";
import { getAuthUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/providers/auth-provider";

export default async function Layout({ children }: any) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  } else {
    return (
      <AuthProvider>
        <NextTopLoader color="#D36737" showSpinner={false} shadow={false} />
        <ClientLayout>{children}</ClientLayout>
      </AuthProvider>
    );
  }
}
