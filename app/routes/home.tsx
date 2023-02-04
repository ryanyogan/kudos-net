import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);

  return json({ users });
}

export default function Home() {
  const { users } = useLoaderData();

  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
      </div>
    </Layout>
  );
}
