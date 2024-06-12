import ClientRedirect from "@/components/ClientRedirect";
import ClientLayout from "./ClientLayout";
import { getAuthUser } from "@/actions/auth";

export default async function Layout({ children }: any) {
  const user = await getAuthUser();

  if (!user) {
    return <ClientRedirect href="/login" message="Session expired..."/>;
  } else {
    return <ClientLayout>{children}</ClientLayout>;
  }
}
