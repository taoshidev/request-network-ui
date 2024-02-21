import { getEndpoint } from "@/actions/endpoints";

import { Endpoint } from "@/components/Endpoint";

export default async function Page({ params }: any) {
  const { id } = params;
  const [result] = await getEndpoint({ id });

  return <Endpoint endpoint={result} />;
}
