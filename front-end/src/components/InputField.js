export default function InputField({
  label = "",
  name,
  type = "text", // Default type is "text"
  placeholder = "",
  options = [],
  required = false, // Add required prop with default value false
}) {
  const isInsightField = name.startsWith("insight");
  const isDropdown = Array.isArray(options) && options.length > 0;
  const isDnfField = name.startsWith("dnf");

  return (
    <div className="mb-2">
      {/* Standard label rendering */}
      {!isDnfField && (
        <label
          htmlFor={name}
          className={`block text-blue-500 ${name === "prod" ? "underline" : ""}`}
        >
          {label}{" "}
          {required && type === "text" && (
            <span className="text-red-500">*</span>
          )}{" "}
          {/* Show asterisk only for required text fields */}
        </label>
      )}
      <div
        className={`mt-2 ${isDnfField ? "flex items-center space-x-2" : ""}`}
      >
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
          <div className={isDnfField ? "flex items-center space-x-2" : ""}>
            {isDnfField && (
              <label htmlFor={name} className="text-blue-500">
                {label}
              </label>
            )}
            <input
              type="checkbox"
              name={name}
              id={name}
              className="rounded border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>
        ) : type === "text" ? (
          <input
            type={type}
            name={name}
            id={name}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
            placeholder={placeholder}
            required={required} // Apply required only for text fields
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
