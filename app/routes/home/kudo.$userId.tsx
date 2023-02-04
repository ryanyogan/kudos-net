import type { Kudo } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Modal } from "~/components/modal";
import { UserCircle } from "~/components/user-circle";
import { getUser } from "~/utils/auth.server";
import { getUserById } from "~/utils/user.server";

export async function loader({ request, params }: LoaderArgs) {
  const { userId } = params;

  if (typeof userId !== "string") {
    return redirect("/home");
  }

  const [recipient, user] = await Promise.all([
    getUserById(userId),
    getUser(request),
  ]);

  return json({ recipient, user });
}

export default function KudoModal() {
  const actionData = useActionData();
  const [formError, setFormError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState<Partial<Kudo>>({
    message: "",
    backgroundColor: "RED",
    textColor: "WHITE",
    emoji: "HANDSUP",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((data) => ({ ...data, [field]: e.target.value }));
  };

  const { recipient, user } = useLoaderData<typeof loader>();

  return (
    <Modal isOpen={true} className="w-full p-4 m-2">
      <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full mb-2">
        {formError}
      </div>

      <form method="post">
        <input type="hidden" value={recipient!.id} name="recipientId" />
        <div className="flex flex-row gap-y-2 md:gap-y-0">
          <div className="text-center flex flex-col items-center gap-y-2 pr-8">
            <UserCircle
              profile={{
                firstName: recipient?.firstName,
                lastName: recipient?.lastName,
              }}
              className="w-20 h-20"
            />
            <p className="text-gray-800">
              {recipient?.firstName} {recipient?.lastName}
            </p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-y-4 mt-4">
          <textarea
            name="message"
            className="w-full rounded h-28 p-2"
            value={formData.message}
            onChange={(e) => handleChange(e, "message")}
            placeholder={`Say something nice about ${recipient.firstName}...`}
          />
          <div className="flex flex-col items-center md:flex-row md:justify-start gap-x-4">
            {/* Select Boxes Go Here */}
          </div>
        </div>
      </form>
    </Modal>
  );
}
