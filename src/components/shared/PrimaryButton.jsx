// components/PrimaryButton.jsx

export default function PrimaryButton({
  children,
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      className={`
        mt-10
        h-20
        px-[50px]
        w-[240px]
        rounded-md
        bg-black
        text-white
        text-base font-medium
        disabled:opacity-20
        disabled:cursor-not-allowed
        cursor-pointer
        transition-opacity duration-200
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}