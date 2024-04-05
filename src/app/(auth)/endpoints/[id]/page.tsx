import { getEndpoint } from "@/actions/endpoints";

import { Endpoint } from "@/components/Endpoint";
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const [result = {}] = await getEndpoint({ id }) ?? [];

  return <Endpoint endpoint={result} />;
}
