import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { db } from "./db.server";
import type { LoginFormInput, RegisterFormInput } from "./types.server";
import { createUser } from "./user.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "kudos-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function register(user: RegisterFormInput) {
  const userExists = await db.user.count({ where: { email: user.email } });
  if (userExists) {
    return json(
      { error: "User already exists with that email" },
      { status: 400 }
    );
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        error: "Something went wrong attempting to create a new user.",
        fields: { email: user.email, password: user.password },
      },
      {
        status: 400,
      }
    );
  }

  return createUserSession(newUser.id, "/");
}

export async function login({ email, password }: LoginFormInput) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: "Incorrect Login" }, { status: 400 });
  }

  return createUserSession(user.id, "/");
}
