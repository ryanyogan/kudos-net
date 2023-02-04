import type { Kudo as IKudo } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Kudo } from "~/components/kudo";
import { Modal } from "~/components/modal";
import { UserCircle } from "~/components/user-circle";
import { getUser, requireUserId } from "~/utils/auth.server";
import { createKudo } from "~/utils/kudo.server";
import { getUserById } from "~/utils/user.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const message = form.get("message");
  const recipientId = form.get("recipientId");

  if (typeof message !== "string" || typeof recipientId !== "string") {
    return json({ error: "Invalid Form Data" }, { status: 400 });
  }

  await createKudo(userId, recipientId, {
    message,
  });

  return redirect("/home");
}

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
  const [formData, setFormData] = useState<Partial<IKudo>>({
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
    <Modal isOpen={true} className="w-full sm:w-1/2 p-4 m-2 ">
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
          <Kudo
            profile={{
              firstName: recipient?.firstName,
              lastName: recipient?.lastName,
            }}
            kudo={formData}
          />
        </div>
        <div className="flex-1 flex flex-col gap-y-4 mt-4">
          <textarea
            name="message"
            className="w-full rounded h-28 p-2 border border-gray-800"
            value={formData.message}
            onChange={(e) => handleChange(e, "message")}
            placeholder={`Say something nice about ${recipient?.firstName}...`}
          />
          <div className="flex items-center flex-row justify-start gap-x-4">
            {/**select */}
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg cursor-pointer mt-2 bg-yellow-300 px-3 py-2 text-gray-800 font-semibold transition duration-300 ease-in-out hover:shadow-md"
        >
          Send
        </button>
      </form>
    </Modal>
  );
}
