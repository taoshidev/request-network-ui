import { Container } from "@mantine/core";
import { useEffect } from "react";

import { getAPIKey } from "@/actions/keys";

import { Keys } from "@/components/Keys";

export default async function Page({ params }) {
  const { id } = params;

  const { error, result } = await getAPIKey({ keyId: id });

  return <Keys apiKey={result} />;
}
