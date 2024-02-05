import { Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Button component={Link} href="/dashboard">
        Dashboard
      </Button>
      <Button component={Link} href="/login">
        Login
      </Button>
      Request Network
    </main>
  );
}
