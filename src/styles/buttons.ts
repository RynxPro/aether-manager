// Standard button styles for the application
export const buttonBase = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center";

export const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-2.5 text-base",
  xl: "px-8 py-3 text-base"
};

export const buttonVariants = {
  primary: "bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white shadow-lg hover:shadow-[var(--moon-glow-violet)]/20",
  secondary: "bg-transparent border border-[var(--moon-border)] text-[var(--moon-text)] hover:bg-[var(--moon-surface-hover)]",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "hover:bg-[var(--moon-surface-hover)] text-[var(--moon-text)]"
};

export const buttonDisabled = "opacity-70 cursor-not-allowed";

// Helper function to combine button classes
export const cnButton = ({
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  disabled = false,
}: {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
} = {}) => {
  return [
    buttonBase,
    buttonSizes[size],
    buttonVariants[variant],
    fullWidth ? "w-full" : "",
    disabled ? buttonDisabled : "",
    className,
  ].filter(Boolean).join(" ");
};
