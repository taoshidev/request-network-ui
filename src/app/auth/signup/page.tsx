import { Suspense } from "react";

import { SignUp } from "@/components/Auth/SignUp";

export default function SignupPage() {
  return (
    <Suspense>
      <SignUp />;
    </Suspense>
  );
}
