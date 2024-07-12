import ClientLayout from "./client-layout";
import NextTopLoader from "nextjs-toploader";

export default async function Layout({ children }: any) {
    return (
      <>
        <NextTopLoader color="#D36737" showSpinner={false} shadow={false} />
        <ClientLayout>{children}</ClientLayout>
      </>
    );
}
