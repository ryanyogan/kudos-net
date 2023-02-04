import type { Kudo } from "@prisma/client";
import { db } from "./db.server";

export async function createKudo(
  userId: string,
  recipientId: string,
  kudo: Partial<Kudo>
) {
  if (typeof kudo.message !== "string") {
    throw new Error("You need a message.");
  }

  return db.kudo.create({
    data: {
      message: kudo.message,
      emoji: "HANDSUP",
      backgroundColor: "WHITE",
      textColor: "BLUE",
      author: {
        connect: {
          id: userId,
        },
      },
      recipient: {
        connect: {
          id: recipientId,
        },
      },
    },
  });
}

export async function getAllKudos() {
  return db.kudo.findMany({
    select: {
      id: true,
      message: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}
