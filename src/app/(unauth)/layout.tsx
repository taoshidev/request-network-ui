import { Box } from "@mantine/core";
import NextTopLoader from "nextjs-toploader";

export default function UnAuthLayout({ children }) {
  return (
    <>
      <NextTopLoader color="#fff" showSpinner={false} shadow={false} />
      {process.env.NEXT_PUBLIC_ENV_NAME && (
        <Box className="z-10 pointer-events-none text-white absolute px-5 font-bold w-full top-0 opacity-60">
          {process.env.NEXT_PUBLIC_ENV_NAME}
        </Box>
      )}
      {children}
    </>
  );
}
