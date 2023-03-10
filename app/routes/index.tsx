import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);
  return redirect("/home");
}
