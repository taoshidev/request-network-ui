import { getEndpoint } from "@/actions/endpoints";

import { UpdateEndpoint } from "@/components/UpdateEndpoint";
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const [result = {}] = await getEndpoint({ id }) ?? [];

  return <UpdateEndpoint endpoint={result} />;
}
