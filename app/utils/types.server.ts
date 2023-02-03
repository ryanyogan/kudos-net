export type RegisterFormInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type LoginFormInput = {
  email: string;
  password: string;
};
