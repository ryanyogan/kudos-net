import { useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";

type FormState = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export default function Login() {
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [action, setAction] = useState<"login" | "register">("login");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "email" | "password" | "firstName" | "lastName"
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

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
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
          />
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
          />

          {action === "register" && (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
              />

              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
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
