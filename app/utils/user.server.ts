import type { RegisterFormInput } from "./types.server";

import bcrypt from "bcryptjs";
import { db } from "./db.server";

export async function createUser(user: RegisterFormInput) {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await db.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return { id: newUser.id, email: user.email };
}

export async function getOtherUsers(userId: string) {
  return db.user.findMany({
    where: {
      // id: { not: userId }
    },
    orderBy: {
      firstName: "asc",
    },
  });
}
