import type { User } from "@prisma/client";

type Props = {
  profile: Partial<User>;
  className?: string;
  onClick?: (...args: any) => void;
};

export function UserCircle({ profile, onClick, className }: Props) {
  return (
    <div
      className={`${className} cursor-pointer bg-gray-200 rounded-full flex justify-center items-center`}
      onClick={onClick}
    >
      <h2 className="text-gray-800 font-light">
        {profile.firstName?.charAt(0).toUpperCase()}
        {profile.lastName?.charAt(0).toUpperCase()}
      </h2>
    </div>
  );
}
