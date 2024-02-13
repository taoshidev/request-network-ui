import { Suspense } from "react";

import { Login } from "./_components/Login";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
