import type { User } from "@prisma/client";
import { useNavigate } from "@remix-run/react";
import { UserCircle } from "./user-circle";

export function UserPanel({ users }: { users: User[] }) {
  const navigate = useNavigate();

  return (
    <div className="w-1/3 flex flex-col">
      <div className="text-center h-20 flex items-center justify-center">
        <h2 className="text-2xl text-gray-800 font-bold">My Team</h2>
      </div>
      <div className="flex-1 overflow-y-scroll py-4 flex flex-col gap-y-10">
        {users.map((user) => (
          <UserCircle
            key={user.id}
            profile={{ firstName: user.firstName, lastName: user.lastName }}
            className="h-24 w-24 mx-auto flex-shrink-0"
            onClick={() => navigate(`kudo/${user.id}`)}
          />
        ))}
      </div>
      <div className="text-center p-2">
        <form action="/logout" method="post">
          <button
            type="submit"
            className="rounded-xl text-sm cursor-pointer mt-2 bg-yellow-300 px-3 py-2 text-gray-800 font-semibold transition duration-300 ease-in-out hover:shadow-md"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
