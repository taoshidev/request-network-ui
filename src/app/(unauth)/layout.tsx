import { Box } from "@mantine/core";

export default function UnAuthLayout({ children }) {
  return (
    <>
      {process.env.NEXT_PUBLIC_ENV_NAME && (
        <Box className="z-10 pointer-events-none text-white absolute px-5 font-bold w-full top-0 opacity-60">
          {process.env.NEXT_PUBLIC_ENV_NAME}
        </Box>
      )}
      {children}
    </>
  );
}
