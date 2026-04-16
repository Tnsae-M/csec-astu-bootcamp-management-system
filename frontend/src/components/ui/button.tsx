interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({
  className = "",
  fullWidth,
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 disabled:cursor-not-allowed disabled:opacity-60";
  const variantStyles =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50";

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
      {...props}
    />
  );
}
