import { cn } from "@/lib/utils";

export const GradientOutlineButton = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "relative z-10 inline-flex items-center justify-center overflow-hidden rounded-xl px-5 py-2 text-sm font-semibold transition",
        "bg-transparent text-white border border-transparent",
        "before:absolute before:inset-0 before:rounded-xl before:border before:border-transparent",
        "before:bg-gradient-to-r before:from-purple-500 before:to-blue-500",
        "before:blur-sm before:opacity-75 before:z-[-1]",
        "hover:before:blur before:transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
