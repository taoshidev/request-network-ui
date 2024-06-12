import ClientLayout from "./ClientLayout";
import { getAuthUser } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: any) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  } else {
    return <ClientLayout>{children}</ClientLayout>;
  }
}
