import { Suspense } from 'react'
import ClientLayout from "./client-layout";
import NextTopLoader from "nextjs-toploader";
import Loading from "./loading";

export default async function Layout({ children }: any) {
    return (
      <Suspense fallback={<Loading />}>
        <NextTopLoader color="#D36737" showSpinner={false} shadow={false} />
        <ClientLayout>{children}</ClientLayout>
      </Suspense>
    );
}
