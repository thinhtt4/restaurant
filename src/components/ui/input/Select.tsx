interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode; // các option
}

export default function SelectInput({
  icon,
  error,
  className,
  children,
  ...rest
}: SelectInputProps) {

  const baseClass =
    "w-full px-[20px] py-[17px] bg-color-input border-0 outline-none text-[17px] rounded-lg";

  const errorStyles = error
    ? "ring-1 ring-red-500 ring-offset-1 focus:ring-red-500"
    : "";

  return (
    <div className="mb-[13px]">
      <div className="relative">
        <select
          className={`${baseClass} ${errorStyles} ${className || ''}`}
          {...rest}
        >
          {children}
        </select>

        {icon && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-left text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
