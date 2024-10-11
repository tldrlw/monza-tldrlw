import postInsight from "@/services/postInsight";
import ImageUpload from "./ImageUpload";

export default function NewInsight(lambdaPostImageFunctionUrl) {
  const teams = [
    "Mercedes-AMG",
    "Ferrari",
    "Red Bull",
    "McLaren",
    "Alpine",
    "Aston Martin",
    "Williams",
    "Sauber",
    "VCaRB",
    "Haas",
    "Not team specfic",
  ];
  const types = [
    "YouTube",
    "News",
    "Podcast",
    "Race",
    "Free Practice",
    "Quali",
    "Other",
    "Sprint",
    "LinkedIn",
    "Instagram",
  ];
  // Sort the arrays alphabetically
  const sortedTeams = teams.sort();
  const sortedTypes = types.sort();

  return (
    <div>
      <ImageUpload lambdaPostImageFunctionUrl={lambdaPostImageFunctionUrl} />
      <form
        action={postInsight}
        // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms
        className="border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm"
      >
        <InputField label="Title" name="title" />
        <InputField label="Link" name="link" />
        <InputField label="Image Link" name="imageLink" />
        <InputField label="Image Credit" name="imageCredit" />
        <InputField
          label="Publication/Channel/Outlet"
          name="publicationOrChannelOrOutlet"
        />
        <InputField
          label="Author(s)/Participants"
          name="authorsOrParticipants"
          placeholder="If more than one, provide names followed by a comma (,)"
        />
        <InputField label="Team" name="team" options={sortedTeams} />
        <InputField label="Type" name="type" options={sortedTypes} />
        <InputField label="Insight 1" name="insight1" />
        <InputField label="Insight 2" name="insight2" />
        <InputField label="Insight 3" name="insight3" />
        <InputField label="Insight 4" name="insight4" />
        <InputField label="Insight 5" name="insight5" />
        <div className="flex justify-end">
          <button
            type="submit"
            className="my-2 rounded-md bg-customOrangeLogo px-4 py-2 font-medium text-white hover:bg-black"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({
  label,
  name,
  type = "text",
  placeholder = "",
  options = [],
}) {
  // Check if the input field is for an insight (to render a textarea)
  const isInsightField = name.startsWith("insight");
  const isDropdown = Array.isArray(options) && options.length > 0; // Check if it's a dropdown

  return (
    <div className="mb-2">
      <label htmlFor={name} className="block text-blue-500">
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
