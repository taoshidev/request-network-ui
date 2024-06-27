import { Suspense } from "react";
import { Box } from "@mantine/core";
import NextTopLoader from "nextjs-toploader";
import Loading from "../(auth)/loading";
import { getAuthUser } from "@/actions/auth";
import { HeaderHome } from "@/components/HeaderHome";
import Footer from "@/components/Footer";

export default async function UnAuthLayout({ children }) {
  const user = await getAuthUser();
  const startLink = user ? "/dashboard" : "/login";

  return (
    <Suspense fallback={<Loading />}>
      <NextTopLoader color="#fff" showSpinner={false} shadow={false} />
      <Box className="bg-stone-100">
        <Box className="bg-primary-500 mb-8">
          <Box className="container max-w-6xl mx-auto mb-10">
            <HeaderHome startLink={startLink} />
          </Box>
        </Box>
        {process.env.NEXT_PUBLIC_ENV_NAME && (
          <Box className="z-10 pointer-events-none text-white absolute px-5 font-bold w-full top-0 opacity-60">
            {process.env.NEXT_PUBLIC_ENV_NAME}
          </Box>
        )}
        <Box className="container max-w-6xl mx-auto px-2 lg:px-20">
          {children}
        </Box>
        <Box className="bg-white">
          <Footer />
        </Box>
      </Box>
    </Suspense>
  );
}
