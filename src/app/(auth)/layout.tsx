import ClientLayout from "./ClientLayout";
import { getAuthUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

export default async function Layout({ children }: any) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  } else {
    return (
      <>
        <NextTopLoader color="#D36737" showSpinner={false} shadow={false} />
        <ClientLayout>{children}</ClientLayout>;
      </>
    );
  }
}
