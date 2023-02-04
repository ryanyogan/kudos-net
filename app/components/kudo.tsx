import type { Kudo as IKudo, User } from "@prisma/client";
import { UserCircle } from "./user-circle";

export function Kudo({
  profile,
  kudo,
}: {
  profile: Partial<User>;
  kudo: Partial<IKudo>;
}) {
  return (
    <div className={`flex bg-white p-4 rounded-sm w-full gap-x-2 relative`}>
      <div>
        <UserCircle
          profile={{
            firstName: profile?.firstName,
            lastName: profile?.lastName,
          }}
          className="h-16 w-16"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-gray-800 whitespace-pre-wrap break-all">
          {profile?.firstName} {profile?.lastName}
        </p>
        <p className="text-gray-600 text-sm whitespace-pre-wrap break-all">
          {kudo.message}
        </p>
      </div>
    </div>
  );
}
