import { getKey } from "@/actions/keys";

import { Keys } from "@/components/Keys";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: any) {
  const { id } = params;
  const { result } = await getKey({ keyId: id });
  return <Keys apiKey={result} />;
}
