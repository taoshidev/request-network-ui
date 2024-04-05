import { getKey } from "@/actions/keys";

import { Keys } from "@/components/Keys";

export default async function Page({ params }: any) {
  const { id } = params;
  const { result } = await getKey({ keyId: id });

  return <Keys apiKey={result} />;
}
