import { redirect } from "next/navigation";

import { getEndpoints } from "@/actions/endpoints";
import { getAuthUser } from "@/actions/auth";

import { Endpoints } from "@/components/Endpoints";

export default async function Page() {
  const user = await getAuthUser();
  const endpoints = await getEndpoints();

  if (!user) {
    redirect("/login");
  }

  return <Endpoints endpoints={endpoints} user={user} />;
}
