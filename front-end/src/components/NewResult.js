import InputField from "./InputField";
import { drivers } from "@/utils";

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

  const positions = Array.from({ length: 20 }, (_, i) => i + 1); // Array of numbers 1-20

  return (
    <div>
      <form className="my-2 border-2 border-solid border-customOrangeLogo p-2 text-xs md:text-sm">
        <InputField label="Race" name="race" />
        <InputField label="Type" name="type" options={sortedTypes} />
        {/* Loop through positions and render a driver input next to each */}
        <div className="mt-4">
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
      </form>
    </div>
  );
}
