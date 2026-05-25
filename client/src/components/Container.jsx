const sizeClasses = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
};

export function Container({ children, className = "", size = "default" }) {
  return (
    <div
      className={`mx-auto w-full min-w-0 ${sizeClasses[size]} px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
