// components/TextInput.jsx

export default function TextInput({
  value,
  onChange,
  type = "text",
  placeholder = "Enter text...",
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col items-center">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-[300px]
          mb-10
          border-0 border-b-2 
          border-gray-200 
          text-center text-gray-500 
          px-3 py-2 
          focus:outline-none 
          focus:border-blue-500 
          focus:px-12 
          transition-all duration-300 ease-in-out
          text-sm
          ${className}
        `}
        {...props}
      />

    </div>
  );
}