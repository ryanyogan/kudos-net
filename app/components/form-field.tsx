type FormFieldProps = {
  htmlFor: string;
  label: string;
  type?: string;
  value: string | undefined;
  onChange?: (...args: any) => void;
};

export function FormField({
  htmlFor,
  label,
  type = "text",
  value,
  onChange = () => {},
}: FormFieldProps) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-gray-800 font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-md my-2 outline-0"
        value={value}
      />
    </>
  );
}
