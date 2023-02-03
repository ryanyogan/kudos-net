import { json } from "@remix-run/node";
import { db } from "./db.server";
import type { RegisterFormInput } from "./types.server";

export async function register(user: RegisterFormInput) {
  const userExists = await db.user.count({ where: { email: user.email } });
  if (userExists) {
    return json(
      { error: "User already exists with that email" },
      { status: 400 }
    );
  }
}
