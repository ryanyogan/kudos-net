import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Kudo } from "~/components/kudo";
import { Layout } from "~/components/layout";
import { UserPanel } from "~/components/user-panel";
import { requireUserId } from "~/utils/auth.server";
import { getAllKudos } from "~/utils/kudo.server";
import { getOtherUsers } from "~/utils/user.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const kudos = await getAllKudos();

  return json({ users, kudos });
}

export default function Home() {
  const { users, kudos } = useLoaderData();

  return (
    <Layout>
      <Outlet />
      <div className="h-full flex">
        <UserPanel users={users} />
        <div className="flex-1 flex flex-col">
          <div className="flex">
            <div className="w-full p-10 grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-4">
              {kudos.map((kudo: any) => (
                <Kudo
                  key={kudo.id}
                  kudo={kudo}
                  profile={{
                    firstName: kudo.author.firstName,
                    lastName: kudo.author.lastName,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
