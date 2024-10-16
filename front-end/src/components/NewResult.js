import InputField from "./InputField";
import { drivers } from "@/utils";
import postResult from "@/services/postResult";

export default function NewResult() {
  const types = [
    "Free Practice 1",
    "Free Practice 2",
    "Free Practice 3",
    "Sprint",
    "Quali",
    "Race",
  ];
  // Sort the array above alphabetically
  const sortedTypes = types.sort();

  const driverNames = drivers.map((driver) => driver.driver);
  const driverNamesWithNA = ["N/A", ...driverNames];
  // If you want to keep driverNames unchanged and create a new array, you can use the spread operator
  // If you want to avoid modifying the original array and create a new one, use the spread operator (...)

  const positions = Array.from({ length: 20 }, (_, i) => i + 1); // Array of numbers 1-20

  return (
    <div>
      <form
        action={postResult}
        // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#forms
        className="my-2 border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm"
      >
        <InputField label="Race" name="race" required={true} />
        <div className="md:flex md:justify-between">
          <InputField label="Type" name="type" options={sortedTypes} />
          <InputField
            label="Fastest Lap"
            name="fastestLap"
            options={driverNamesWithNA}
          />
          <InputField
            label="Driver of the Day"
            name="driverOfTheDay"
            options={driverNamesWithNA}
          />
        </div>
        {/* Loop through positions and render a driver input next to each */}
        <div className="mt-4 md:mt-2">
          {positions.map((position, index) => (
            <div
              key={index}
              className="my-2 flex justify-between border-2 border-dotted border-gray-300 p-2"
            >
              {/* Static position value */}
              <div className="ml-2 mt-4 font-bold">{position}</div>
              {/* Driver input field next to the position */}
              <div>
                <InputField name={`driver-${position}`} options={driverNames} />
              </div>
              <div className="mr-2 mt-2">
                <InputField label="DNF?" name="dnf" type="checkbox" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="my-2 rounded-md bg-customOrangeLogo px-4 py-2 font-medium text-white transition duration-200 hover:bg-black"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
