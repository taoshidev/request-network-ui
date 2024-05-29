import { getAuthUser } from "@/actions/auth";
import { Home } from "@/components/Home";

export default  async function Page() {
  const user = await getAuthUser();
  const startLink = user ? '/dashboard' : '/login';

  return <Home startLink={startLink} />;
}
