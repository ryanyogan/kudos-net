import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export async function action({ request }: ActionArgs) {
  return logout(request);
}

export function loader() {
  return redirect("/");
}
