import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import { useActionData } from "react-router";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import { getUser, login, register } from "~/utils/auth.server";

import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";

type FormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const action = form.get("_action") as FormAction;
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  }

  switch (action) {
    case "login": {
      return await login({ email, password });
    }

    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }

    default:
      return json({ error: "Invalid Form Data" }, { status: 400 });
  }
}

export async function loader({ request }: LoaderArgs) {
  return (await getUser(request)) ? redirect("/") : null;
}

type FormAction = "register" | "login";

type ActionData = {
  error?: string;
  fields?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
  errors?: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  };
  form?: string;
};

export default function Login() {
  const actionData = useActionData() as ActionData;
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || "");

  const [formData, setFormData] = useState<FormState>({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
  });

  const [action, setAction] = useState<FormAction>("login");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "email" | "password" | "firstName" | "lastName"
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  useEffect(() => {
    if (!firstLoad.current) {
      const newState: FormState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
    console.log(firstLoad.current);
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  return (
    <Layout>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <button
          onClick={() => setAction(action === "login" ? "register" : "login")}
          className="absolute right-8 top-8 rounded-xl cursor-pointer mt-2 bg-yellow-300 px-3 py-2 text-gray-800 font-semibold transition duration-300 ease-in-out hover:shadow-md"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>
        <h2 className="text-5xl font-extrabold text-gray-800">
          Welcome to Kudos!
        </h2>
        <p className="font-semibold text-gray-500">
          {action === "login"
            ? "Log In To Give Some Praise!"
            : "Sign Up To Get Started!"}
        </p>

        <form
          method="POST"
          className="rounded-2xl shadow-lg bg-yellow-300 p-6 w-96"
        >
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {formError}
          </div>
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={errors?.email}
          />
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={errors?.password}
          />

          {action === "register" && (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                error={errors?.firstName}
              />

              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                error={errors?.lastName}
              />
            </>
          )}

          <div className="w-full text-center">
            <button
              name="_action"
              value={action}
              type="submit"
              className="rounded-xl cursor-pointer mt-2 bg-yellow-300 px-3 py-2 text-gray-800 font-semibold transition duration-300 ease-in-out hover:shadow-md"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
