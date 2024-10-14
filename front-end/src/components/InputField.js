export default function InputField({
  label,
  name,
  type = "text",
  placeholder = "",
  options = [],
}) {
  const isInsightField = name.startsWith("insight");
  const isDropdown = Array.isArray(options) && options.length > 0;

  return (
    <div className="mb-2">
      <label
        htmlFor={name}
        className={`block text-blue-500 ${name === "prod" ? "underline" : ""}`}
      >
        {label}
      </label>
      <div className="mt-2">
        {isDropdown ? (
          <select
            name={name}
            id={name}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : isInsightField ? (
          <textarea
            name={name}
            id={name}
            className="block h-20 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
            placeholder={placeholder}
          ></textarea>
        ) : type === "checkbox" ? (
          <input
            type="checkbox"
            name={name}
            id={name}
            className="rounded border-gray-300 shadow-sm focus:border-black focus:ring-black"
          />
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
