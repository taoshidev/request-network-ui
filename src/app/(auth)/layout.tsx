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
// import { AppShell, Container } from "@mantine/core";
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
// import { AuthProvider } from "@/providers/auth-provider";

// export default function Layout({ children }: any) {
//   return (
//     <AuthProvider>
//       <AppShell className="flex flex-col min-h-screen">
//         <AppShell.Header className="sticky h-[90px] flex-none">
//           <Header />
//         </AppShell.Header>
//         <AppShell.Main className="flex-grow bg-stone-100 overflow-auto">
//           <Container className="py-16 max-w-6xl scrollbar-hide">
//             {children}
//           </Container>
//         </AppShell.Main>
//         <AppShell.Footer className="relative h-[185px] flex-none">
//           <Footer />
//         </AppShell.Footer>
//       </AppShell>
//     </AuthProvider>
//   );
}
